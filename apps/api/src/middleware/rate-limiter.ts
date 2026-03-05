import type { Context, Next } from "hono";
import { redis } from "../lib/redis";

interface RateLimitConfig {
  window: number; // Time window in seconds
  max: number; // Max requests per window
}

const defaultConfig: RateLimitConfig = {
  window: 60, // 1 minute
  max: 100, // 100 requests per minute
};

export function rateLimiter(config: RateLimitConfig = defaultConfig) {
  return async (c: Context, next: Next) => {
    try {
      // Get client identifier (IP address or user ID)
      const identifier =
        c.req.header("x-forwarded-for") ||
        c.req.header("x-real-ip") ||
        "unknown";

      const key = `rate-limit:${identifier}`;

      // Get current count
      const current = await redis.get(key);
      const count = current ? parseInt(current, 10) : 0;

      if (count >= config.max) {
        return c.json(
          {
            error: "Too many requests",
            message: `Rate limit exceeded. Please try again later.`,
          },
          429,
        );
      }

      // Increment counter
      const pipeline = redis.pipeline();
      pipeline.incr(key);

      // Set expiry on first request
      if (count === 0) {
        pipeline.expire(key, config.window);
      }

      await pipeline.exec();

      // Set rate limit headers
      c.header("X-RateLimit-Limit", config.max.toString());
      c.header("X-RateLimit-Remaining", (config.max - count - 1).toString());
      c.header(
        "X-RateLimit-Reset",
        (Date.now() + config.window * 1000).toString(),
      );

      await next();
    } catch (error) {
      console.error("Rate limiter error:", error);
      // Continue on error (fail open)
      await next();
    }
  };
}

// Stricter rate limit for auth endpoints
export function authRateLimiter() {
  return rateLimiter({
    window: 300, // 5 minutes
    max: 5, // 5 requests per 5 minutes
  });
}
