# InfinityLoop

A full-stack application built with Turborepo, Bun, and TypeScript.

## Project Structure

- **apps/web** - Svelte frontend with Skeleton UI, Tailwind CSS, and TanStack Query
- **apps/api** - Hono API with Drizzle ORM, Lucia Auth, Redis, and rate limiting

## Prerequisites

- [Bun](https://bun.sh) >= 1.0
- [Docker](https://www.docker.com/) and Docker Compose

## Getting Started

1. Install dependencies:

```bash
bun install
```

2. Start Docker services (PostgreSQL & Redis):

```bash
bun run docker:up
```

3. Set up environment variables:

```bash
# Copy .env.example files in both apps and configure them
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

4. Run database migrations:

```bash
cd apps/api
bun run db:push
```

5. Start development servers:

```bash
bun run dev
```

The web app will be available at http://localhost:5173
The API will be available at http://localhost:3000
The API documentation (Swagger UI) will be available at http://localhost:3000/api/swagger

## Available Scripts

- `bun run dev` - Start all apps in development mode
- `bun run build` - Build all apps
- `bun run lint` - Lint all apps
- `bun run type-check` - Type check all apps
- `bun run docker:up` - Start Docker services
- `bun run docker:down` - Stop Docker services

## Documentation

- **API Documentation**: Interactive Swagger UI available at http://localhost:3000/api/swagger (when running)
- [Architecture Overview](./ARCHITECTURE.md) - System architecture and design decisions
- [Quick Start Guide](./QUICKSTART.md) - Fast setup instructions
- [Contributing Guidelines](./CONTRIBUTING.md) - How to contribute to the project

## Tech Stack

### Web App

- Svelte
- Skeleton UI
- Tailwind CSS
- TanStack Query

### API

- Hono
- Drizzle ORM
- Lucia Auth
- Redis
- Rate limiting

### Infrastructure

- PostgreSQL
- Redis
- Docker
