import { OpenAPIHono } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import healthRoute from "./routes/health";
import authRoutes from "./routes/auth";
import { rateLimiter } from "./middleware/rate-limiter";
import type { Env } from "./types";

const app = new OpenAPIHono<Env>();

// Middleware
app.use("*", logger());

if (process.env.NODE_ENV !== "production") {
  app.use("*", prettyJSON());
}

app.use(
  "*",
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  }),
);

// Rate limiting
app.use("*", rateLimiter());

// Routes
app.route("/api/health", healthRoute);
app.route("/api/auth", authRoutes);

// Register security schemes
app.openAPIRegistry.registerComponent("securitySchemes", "bearerAuth", {
  type: "http",
  scheme: "bearer",
  bearerFormat: "session_id",
  description:
    "Session ID obtained from login or signup. Can also be sent as HTTP-only cookie.",
});

// OpenAPI documentation
app.doc("/api/doc", {
  openapi: "3.1.0",
  info: {
    title: "InfinityLoop API",
    version: "1.0.0",
    description:
      "Full-stack application API with authentication, built with Hono, Drizzle ORM, and Lucia Auth",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Development server",
    },
  ],
  tags: [
    {
      name: "Health",
      description: "Health check endpoints",
    },
    {
      name: "Authentication",
      description: "User authentication and session management",
    },
  ],
  externalDocs: {
    description: "Project Architecture",
    url: "https://github.com/ezaz-ahmed/infinityloop",
  },
});

// Swagger UI
app.get("/api/swagger", swaggerUI({ url: "/api/doc" }));

// Error handling
app.onError((err, c) => {
  console.error(`${err}`);
  return c.json({ error: err.message }, 500);
});

// 404 handler
app.notFound((c) => {
  return c.json({ error: "Not Found" }, 404);
});

const port = Number(process.env.PORT) || 3000;

console.log(`🚀 Server running on http://localhost:${port}`);

export default {
  port,
  fetch: app.fetch,
};
