import { createRoute, z } from "@hono/zod-openapi";

export const healthRoute = createRoute({
  method: "get",
  path: "/",
  tags: ["Health"],
  summary: "Health check",
  description: "Check if the API is running and operational",
  responses: {
    200: {
      description: "API is healthy",
      content: {
        "application/json": {
          schema: z.object({
            status: z.string().openapi({ example: "ok" }),
            message: z.string().openapi({ example: "API is running" }),
            timestamp: z
              .string()
              .openapi({ example: "2026-03-05T10:30:00.000Z" }),
          }),
        },
      },
    },
  },
});
