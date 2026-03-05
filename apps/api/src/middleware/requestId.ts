import type { Context, Next } from "hono";
import { randomUUID } from "crypto";

export function requestId() {
  return async (c: Context, next: Next) => {
    // Check if request ID already exists (e.g., from load balancer)
    const existingRequestId = c.req.header("x-request-id");
    const requestId = existingRequestId || randomUUID();

    // Store request ID in context for use in other middleware/handlers
    c.set("requestId", requestId);

    // Add request ID to response headers
    c.header("x-request-id", requestId);

    await next();
  };
}
