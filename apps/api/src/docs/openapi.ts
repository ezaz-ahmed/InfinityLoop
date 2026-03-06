import { env } from "../utils/env";

const serverUrls: Record<string, string> = {
  development: "http://localhost:8080",
  staging: "https://staging-api.myapp.com",
  production: "https://api.myapp.com",
};

export const openAPIDocs = {
  openapi: "3.1.0",
  info: {
    title: "InfinityLoop API",
    version: "1.0.0",
    description:
      "Full-stack application API with authentication, built with Hono, Drizzle ORM, and Lucia Auth. " +
      "This API follows REST principles and provides comprehensive documentation for all endpoints.",
    contact: {
      name: "API Support",
      url: "https://github.com/ezaz-ahmed/infinityloop",
    },
    license: {
      name: "MIT",
      url: "https://opensource.org/licenses/MIT",
    },
  },
  servers: [
    {
      url: serverUrls[env.APP_ENV] || serverUrls.development,
      description: `${env.APP_ENV.charAt(0).toUpperCase() + env.APP_ENV.slice(1)} server`,
    },
  ],
  tags: [
    {
      name: "Health",
      description: "Health check and readiness probe endpoints",
    },
    {
      name: "Authentication",
      description: "User authentication and session management endpoints",
    },
  ],
  externalDocs: {
    description: "Project Architecture Documentation",
    url: "https://github.com/ezaz-ahmed/infinityloop",
  },
  security: [],
};

export const securitySchemes = {
  bearerAuth: {
    type: "http" as const,
    scheme: "bearer",
    bearerFormat: "session_id",
    description:
      "Session ID obtained from login or signup. Can also be sent as HTTP-only cookie.",
  },
};
