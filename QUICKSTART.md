# Turborepo Starter for InfinityLoop

This starter was created on March 5, 2026.

## Quick Start

### Windows

```bash
setup.bat
bun run dev
```

### macOS/Linux

```bash
chmod +x setup.sh
./setup.sh
bun run dev
```

## What's Included

### Apps

- **Web**: Svelte + Skeleton UI + Tailwind CSS + TanStack Query (http://localhost:5173)
- **API**: Hono + Drizzle ORM + Lucia Auth + Redis (http://localhost:3000)

### Infrastructure

- PostgreSQL 16 (port 5432)
- Redis 7 (port 6379)
- Docker Compose configuration

### Features

- ✅ Full TypeScript support
- ✅ Session-based authentication with Lucia
- ✅ Rate limiting with Redis
- ✅ Argon2 password hashing
- ✅ CORS protection
- ✅ Database ORM with Drizzle
- ✅ Modern UI with Skeleton UI
- ✅ API client with TanStack Query

## Documentation

- [Architecture Overview](ARCHITECTURE.md)
- [Contributing Guide](CONTRIBUTING.md)
- [License](LICENSE)

## Development

All commands run from the root:

```bash
bun run dev         # Start all apps in development
bun run build       # Build all apps
bun run type-check  # Type check all apps
bun run lint        # Lint all apps
bun run docker:up   # Start Docker services
bun run docker:down # Stop Docker services
```

## Next Steps

1. Customize the web app UI in `apps/web/src`
2. Add API endpoints in `apps/api/src/routes`
3. Modify the database schema in `apps/api/src/db/schema.ts`
4. Configure environment variables (see `.env.example` files)

Enjoy building with InfinityLoop! 🚀
