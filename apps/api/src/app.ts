import { OpenAPIHono } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";
import { cors } from "hono/cors";
import { prettyJSON } from "hono/pretty-json";
import { env } from "./utils/env";
import { customLogger } from "./utils/logger";
import { requestId } from "./middleware/requestId";
import { rateLimiter } from "./middleware/rateLimiter";
import healthRoutes from "./routes/health";
import authRoutes from "./routes/auth";
import { openAPIDocs, securitySchemes } from "./docs/openapi";
import type { Env } from "./types";

const app = new OpenAPIHono<Env>();

// Request ID middleware (must be first to generate ID for logging)
app.use("*", requestId());

// Custom logger with request ID support
app.use("*", customLogger());

// Pretty JSON only in development
if (env.APP_ENV === "development") {
  app.use("*", prettyJSON());
}

// CORS configuration based on environment
const allowedOrigins: Record<string, string[]> = {
  development: [env.FRONTEND_URL, "http://localhost:5173"],
  staging: [env.FRONTEND_URL],
  production: [env.FRONTEND_URL],
};

app.use(
  "*",
  cors({
    origin: allowedOrigins[env.APP_ENV] || allowedOrigins.development,
    credentials: true,
  }),
);

// Rate limiting with environment-based configuration
app.use("*", rateLimiter());

// API v1 routes
app.route("/api/v1/health", healthRoutes);
app.route("/api/v1/auth", authRoutes);

// Register security schemes for OpenAPI
app.openAPIRegistry.registerComponent(
  "securitySchemes",
  "bearerAuth",
  securitySchemes.bearerAuth,
);

// OpenAPI documentation
app.doc("/api/doc", openAPIDocs);

// Swagger UI
app.get("/api/swagger", swaggerUI({ url: "/api/doc" }));

// Global error handler
app.onError((err, c) => {
  const requestId = c.get("requestId") || "unknown";
  console.error(`[${requestId}] Error:`, err);

  const message =
    env.APP_ENV === "production" || env.APP_ENV === "staging"
      ? "Internal Server Error"
      : err.message;

  return c.json({ error: message, requestId }, 500);
});

// 404 handler
app.notFound((c) => {
  return c.json({ error: "Not Found" }, 404);
});

export default app;
