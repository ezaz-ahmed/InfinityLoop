# API Refactoring Guide

## Overview

The InfinityLoop API has been refactored with improved structure, environment-based configuration, and production-ready features.

## Major Changes

### 1. Environment Configuration

**New file:** `src/utils/env.ts`

- All environment variables are now validated using Zod
- Type-safe access to environment variables throughout the app
- Automatic validation on startup with clear error messages

**Required environment variables:**

```env
APP_ENV=development              # development | staging | production
NODE_ENV=development             # optional
PORT=3000
FRONTEND_URL=http://localhost:5173
DATABASE_URL=postgresql://...
REDIS_URL=redis://localhost:6379  # optional
```

### 2. Project Structure

```
src/
  app.ts                    # Hono app configuration
  server.ts                 # Server startup

  routes/
    auth/
      auth.openapi.ts       # Auth OpenAPI schemas
      signup.ts             # Signup route
      login.ts              # Login route
      profile.ts            # Profile routes (me, logout)
      index.ts              # Auth routes aggregator
    health/
      health.openapi.ts     # Health OpenAPI schemas
      index.ts              # Health routes (/live, /ready)

  middleware/
    rateLimiter.ts          # Rate limiting (environment-aware)
    requestId.ts            # Request ID generation

  services/
    auth.service.ts         # Auth business logic

  db/
    client.ts               # Database client
    schema.ts               # Database schema

  docs/
    openapi.ts              # OpenAPI documentation

  utils/
    logger.ts               # Custom logger
    env.ts                  # Environment validation
```

### 3. API Versioning

All API routes now use `/api/v1` prefix:

- `/api/v1/health/live` - Liveness probe
- `/api/v1/health/ready` - Readiness probe (checks DB)
- `/api/v1/auth/signup` - User registration
- `/api/v1/auth/login` - User login
- `/api/v1/auth/logout` - User logout
- `/api/v1/auth/me` - Get current user

### 4. Health Checks

**Liveness probe** (`/api/v1/health/live`):

- Always returns 200 if service is running
- Use for Kubernetes/Docker liveness probes

**Readiness probe** (`/api/v1/health/ready`):

- Checks database connectivity
- Returns 200 if ready, 503 if not ready
- Use for Kubernetes/Docker readiness probes

### 5. Improved CORS

CORS configuration is now environment-aware:

```typescript
const allowedOrigins = {
  development: [env.FRONTEND_URL, "http://localhost:5173"],
  staging: [env.FRONTEND_URL],
  production: [env.FRONTEND_URL],
};
```

### 6. Enhanced Logging

**New file:** `src/utils/logger.ts`

- Environment-aware log levels:
  - Development: debug, info, warn, error
  - Staging: info, warn, error
  - Production: warn, error only
- Request ID attached to all logs
- Response time tracking
- Structured JSON logging support

### 7. Request ID Middleware

**New file:** `src/middleware/requestId.ts`

- Generates unique ID for each request
- Adds `x-request-id` header to responses
- Available in context for logging and debugging
- Respects existing request IDs from load balancers

### 8. Environment-Based Rate Limiting

Rate limits now adjust based on environment:

**General endpoints:**

- Development: 200 req/min
- Staging: 100 req/min
- Production: 60 req/min

**Auth endpoints:**

- Development: 10 req/5min
- Staging: 5 req/5min
- Production: 5 req/5min

### 9. Error Handling

Improved global error handler:

- Hides internal errors in staging/production
- Includes request ID in error responses
- Environment-aware error messages

### 10. Service Layer

**New file:** `src/services/auth.service.ts`

- Business logic separated from route handlers
- Reusable authentication methods
- Cleaner route handlers

## Breaking Changes

### Import Paths

Old:

```typescript
import { db } from "../lib/db";
```

New:

```typescript
import { db } from "../db/client";
// or use the re-export for compatibility
import { db } from "../lib/db";
```

### API Endpoints

All endpoints now have `/v1` prefix:

- Old: `/api/auth/login`
- New: `/api/v1/auth/login`

### Environment Variables

New required variables:

- `APP_ENV` (required)
- `FRONTEND_URL` (required)

## Migration Steps

1. **Update environment variables:**

   ```bash
   cp apps/api/.env.example apps/api/.env
   # Edit .env and add APP_ENV and FRONTEND_URL
   ```

2. **Install dependencies** (if needed):

   ```bash
   cd apps/api
   bun install
   ```

3. **Update frontend API calls:**
   Update all API endpoint URLs to include `/v1`:

   ```typescript
   // Old
   fetch('/api/auth/login', ...)

   // New
   fetch('/api/v1/auth/login', ...)
   ```

4. **Start the server:**

   ```bash
   bun run dev
   ```

5. **Test the API:**
   - Visit: http://localhost:3000/api/swagger
   - Test health: http://localhost:3000/api/v1/health/live
   - Test readiness: http://localhost:3000/api/v1/health/ready

## Features Summary

✅ Type-safe environment configuration with Zod
✅ API versioning (`/api/v1`)
✅ Request ID middleware for tracing
✅ Enhanced logging with request IDs
✅ Environment-aware rate limiting
✅ Improved CORS configuration
✅ Health check endpoints (live/ready)
✅ Service layer for business logic
✅ Production-ready error handling
✅ Clean project structure
✅ OpenAPI documentation refactored
✅ Pretty JSON only in development

## Documentation

- Swagger UI: http://localhost:3000/api/swagger
- OpenAPI Spec: http://localhost:3000/api/doc

## Configuration Examples

### Development

```env
APP_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:5173
DATABASE_URL=postgresql://...
```

### Staging

```env
APP_ENV=staging
PORT=3000
FRONTEND_URL=https://staging.myapp.com
DATABASE_URL=postgresql://...
```

### Production

```env
APP_ENV=production
PORT=3000
FRONTEND_URL=https://myapp.com
DATABASE_URL=postgresql://...
```

## Notes

- The old `index.ts` file has been replaced with `app.ts` and `server.ts`
- Package.json scripts updated to use `server.ts`
- All middleware is now conditionally loaded based on environment
- Rate limiting is more lenient in development
- Pretty JSON output is disabled in staging/production for performance
