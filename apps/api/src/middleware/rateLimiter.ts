import type { Context, Next } from "hono";
import { redis } from "../lib/redis";
import { env } from "../utils/env";

interface RateLimitConfig {
  window: number; // Time window in seconds
  max: number; // Max requests per window
}

// Environment-based rate limit configurations
const DEFAULT_CONFIGS: Record<string, RateLimitConfig> = {
  development: {
    window: 60, // 1 minute
    max: 200, // 200 requests per minute (lenient for dev)
  },
  staging: {
    window: 60,
    max: 100, // 100 requests per minute
  },
  production: {
    window: 60,
    max: 60, // 60 requests per minute (stricter)
  },
};

const AUTH_CONFIGS: Record<string, RateLimitConfig> = {
  development: {
    window: 300, // 5 minutes
    max: 10, // 10 attempts per 5 minutes
  },
  staging: {
    window: 300,
    max: 5, // 5 attempts per 5 minutes
  },
  production: {
    window: 300,
    max: 5, // 5 attempts per 5 minutes (strict)
  },
};

export function rateLimiter(customConfig?: RateLimitConfig) {
  const config = customConfig || DEFAULT_CONFIGS[env.APP_ENV];

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
  return rateLimiter(AUTH_CONFIGS[env.APP_ENV]);
}
