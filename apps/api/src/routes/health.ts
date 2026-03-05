import { OpenAPIHono } from "@hono/zod-openapi";
import { healthRoute } from "./health.openapi";

const app = new OpenAPIHono();

app.openapi(healthRoute, (c) => {
  return c.json({
    status: "ok",
    message: "API is running",
    timestamp: new Date().toISOString(),
  });
});

export default app;
