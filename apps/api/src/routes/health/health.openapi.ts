import { createRoute, z } from "@hono/zod-openapi";

const healthResponseSchema = z.object({
  status: z.enum(["ok", "degraded", "error"]).openapi({ example: "ok" }),
  message: z.string().openapi({ example: "Service is healthy" }),
  timestamp: z.string().openapi({ example: "2026-03-06T10:30:00.000Z" }),
  checks: z
    .object({
      database: z
        .enum(["connected", "disconnected", "error"])
        .optional()
        .openapi({ example: "connected" }),
    })
    .optional(),
});

export const liveRoute = createRoute({
  method: "get",
  path: "/live",
  tags: ["Health"],
  summary: "Liveness probe",
  description:
    "Check if the service is alive. Returns 200 if the service is running, regardless of dependency status.",
  responses: {
    200: {
      description: "Service is alive",
      content: {
        "application/json": {
          schema: healthResponseSchema,
        },
      },
    },
  },
});

export const readyRoute = createRoute({
  method: "get",
  path: "/ready",
  tags: ["Health"],
  summary: "Readiness probe",
  description:
    "Check if the service is ready to accept traffic. Validates database connectivity and other critical dependencies.",
  responses: {
    200: {
      description: "Service is ready",
      content: {
        "application/json": {
          schema: healthResponseSchema,
        },
      },
    },
    503: {
      description: "Service is not ready",
      content: {
        "application/json": {
          schema: healthResponseSchema,
        },
      },
    },
  },
});
