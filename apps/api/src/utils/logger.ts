import type { Context } from "hono";
import { env } from "./env";

type LogLevel = "debug" | "info" | "warn" | "error";

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const MIN_LOG_LEVEL: Record<string, LogLevel> = {
  development: "debug",
  staging: "info",
  production: "warn",
};

function shouldLog(level: LogLevel): boolean {
  const minLevel = MIN_LOG_LEVEL[env.APP_ENV] || "info";
  return LOG_LEVELS[level] >= LOG_LEVELS[minLevel];
}

function formatMessage(
  level: LogLevel,
  message: string,
  requestId?: string,
  meta?: Record<string, any>,
): string {
  const timestamp = new Date().toISOString();
  const parts = [
    `[${timestamp}]`,
    `[${level.toUpperCase()}]`,
    requestId ? `[${requestId}]` : null,
    message,
    meta ? JSON.stringify(meta) : null,
  ].filter(Boolean);

  return parts.join(" ");
}

export const logger = {
  debug(message: string, requestId?: string, meta?: Record<string, any>) {
    if (shouldLog("debug")) {
      console.debug(formatMessage("debug", message, requestId, meta));
    }
  },

  info(message: string, requestId?: string, meta?: Record<string, any>) {
    if (shouldLog("info")) {
      console.info(formatMessage("info", message, requestId, meta));
    }
  },

  warn(message: string, requestId?: string, meta?: Record<string, any>) {
    if (shouldLog("warn")) {
      console.warn(formatMessage("warn", message, requestId, meta));
    }
  },

  error(message: string, requestId?: string, meta?: Record<string, any>) {
    if (shouldLog("error")) {
      console.error(formatMessage("error", message, requestId, meta));
    }
  },
};

// Custom logger middleware for Hono
export function customLogger() {
  return async (c: Context, next: any) => {
    const start = Date.now();
    const requestId = c.get("requestId") || "unknown";

    await next();

    const elapsed = Date.now() - start;
    const method = c.req.method;
    const path = c.req.path;
    const status = c.res.status;

    logger.info(`${method} ${path} ${status}`, requestId, {
      responseTime: `${elapsed}ms`,
    });
  };
}
