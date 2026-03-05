# Project Architecture

## Overview

InfinityLoop is a full-stack application built with a monorepo architecture using Turborepo. It consists of two main applications: a web frontend and an API backend.

## Technology Stack

### Frontend (apps/web)

- **Framework**: Svelte 5
- **UI Library**: Skeleton UI with Tailwind CSS
- **Build Tool**: Vite
- **Package Manager**: Bun

### Backend (apps/api)

- **Framework**: Hono (lightweight web framework)
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Lucia Auth with session-based auth
- **Caching & Rate Limiting**: Redis (ioredis)
- **Password Hashing**: @node-rs/argon2
- **Validation**: Zod
- **Runtime**: Bun

### Infrastructure

- **Monorepo**: Turborepo
- **Containers**: Docker & Docker Compose
- **Database**: PostgreSQL 16
- **Cache**: Redis 7

## Database Schema

### User Table

- `id`: Primary key (text)
- `email`: Unique email address
- `password_hash`: Argon2 hashed password
- `name`: User's display name
- `created_at`: Timestamp
- `updated_at`: Timestamp

### Session Table (Lucia Auth)

- `id`: Primary key (text)
- `user_id`: Foreign key to user table
- `expires_at`: Session expiration timestamp

## API Endpoints

### Health

- `GET /api/health` - Check API status

### Authentication

- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/logout` - Logout and invalidate session
- `GET /api/auth/me` - Get current user (requires auth)

## Security Features

1. **Rate Limiting**: Redis-based rate limiting to prevent abuse
   - General endpoints: 100 requests/minute
   - Auth endpoints: 5 requests/5 minutes

2. **Password Security**: Argon2 password hashing with secure parameters

3. **Session Management**: Server-side sessions with Lucia Auth
   - HTTP-only cookies
   - Session expiration
   - Session refresh on activity

4. **CORS Protection**: Configured to only allow requests from the web app

5. **Input Validation**: Zod schema validation for all inputs

## Development Workflow

1. **Install Dependencies**: `bun install`
2. **Start Services**: `bun run docker:up`
3. **Run Migrations**: `cd apps/api && bun run db:push`
4. **Development**: `bun run dev`

## Deployment Considerations

### Environment Variables

**API (.env)**:

- `PORT`: API server port
- `DATABASE_URL`: PostgreSQL connection string
- `REDIS_URL`: Redis connection string
- `NODE_ENV`: Environment (production/development)

**Web (.env)**:

- `VITE_API_URL`: API base URL

### Production Checklist

- [ ] Set secure environment variables
- [ ] Enable HTTPS
- [ ] Configure CORS for production domain
- [ ] Set up database backups
- [ ] Configure Redis persistence
- [ ] Enable monitoring and logging
- [ ] Set up CI/CD pipeline
- [ ] Configure rate limiting for production load

## Monitoring & Observability

Consider adding:

- Application logging (e.g., Pino)
- Error tracking (e.g., Sentry)
- Performance monitoring (e.g., New Relic)
- Database query monitoring

## API Documentation

Interactive API documentation is available via **Swagger UI** at `/api/swagger` when the API is running.

The OpenAPI specification provides:

- Complete endpoint reference with request/response schemas
- Interactive API testing interface
- Authentication configuration (Bearer token and session cookies)
- Zod schema validation documentation
- Rate limiting information
- Example requests and responses

Access the documentation at: http://localhost:3000/api/swagger (development)

The raw OpenAPI spec is available at: http://localhost:3000/api/doc

## Future Enhancements

- Add email verification
- Implement password reset flow
- Add refresh tokens
- Add test suite (unit & integration tests)
- Implement CI/CD pipeline
- Add health checks for dependencies
- Set up monitoring and alerting
