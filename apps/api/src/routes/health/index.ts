import { OpenAPIHono } from "@hono/zod-openapi";
import { liveRoute, readyRoute } from "./health.openapi";
import { db } from "../../db/client.ts";
import { sql } from "drizzle-orm";

const app = new OpenAPIHono();

// Liveness probe - always returns 200 if service is running
app.openapi(liveRoute, (c) => {
  return c.json({
    status: "ok",
    message: "Service is alive",
    timestamp: new Date().toISOString(),
  });
});

// Readiness probe - checks database connectivity
app.openapi(readyRoute, async (c) => {
  const checks: Record<string, string> = {};
  let isReady = true;

  // Check database connectivity
  try {
    await db.execute(sql`SELECT 1`);
    checks.database = "connected";
  } catch (error) {
    checks.database = "disconnected";
    isReady = false;
  }

  if (!isReady) {
    return c.json(
      {
        status: "error",
        message: "Service is not ready",
        timestamp: new Date().toISOString(),
        checks,
      },
      503,
    );
  }

  return c.json({
    status: "ok",
    message: "Service is ready",
    timestamp: new Date().toISOString(),
    checks,
  });
});

export default app;
