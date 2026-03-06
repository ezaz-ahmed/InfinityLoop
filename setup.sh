#!/bin/bash

echo "🚀 Setting up InfinityLoop project..."

# Check if bun is installed
if ! command -v bun &> /dev/null; then
    echo "❌ Bun is not installed. Please install it from https://bun.sh"
    exit 1
fi

# Check if docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install it from https://docker.com"
    exit 1
fi

# Check if docker is running
if ! docker info &> /dev/null; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Install dependencies
echo "📦 Installing dependencies..."
bun install

# Copy environment files
echo "📝 Setting up environment files..."
if [ ! -f apps/api/.env ]; then
    cp apps/api/.env.example apps/api/.env
    echo "✅ Created apps/api/.env"
fi

if [ ! -f apps/web/.env ]; then
    cp apps/web/.env.example apps/web/.env
    echo "✅ Created apps/web/.env"
fi

# Start Docker services
echo "🐳 Starting Docker services (PostgreSQL & Redis)..."
docker-compose up -d

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 5

# Run database migrations
echo "🗄️  Running database migrations..."
cd apps/api
bun run db:push
cd ../..

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the development servers, run:"
echo "  bun run dev"
echo ""
echo "Web app will be available at: http://localhost:5173"
echo "API will be available at: http://localhost:8080"
echo ""
