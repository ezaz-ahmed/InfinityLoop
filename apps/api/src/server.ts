import app from "./app";
import { env } from "./utils/env";
import { logger } from "./utils/logger";

const port = env.PORT;

console.log(`
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  🚀 InfinityLoop API Server                                 │
│                                                             │
│  Environment: ${env.APP_ENV.toUpperCase()}                                   │
│  Port:        ${port}                                          │
│                                                             │
│  📍 API:   http://localhost:${port}/api/v1                     │
│  📚 Docs:  http://localhost:${port}/api/swagger                │
│                                                             │
└─────────────────────────────────────────────────────────────┘
`);

logger.info("Server starting", undefined, {
  environment: env.APP_ENV,
  port,
  nodeEnv: process.env.NODE_ENV,
});

export default {
  port,
  fetch: app.fetch,
};
