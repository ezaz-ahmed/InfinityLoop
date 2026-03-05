@echo off
echo 🚀 Setting up InfinityLoop project...

:: Check if bun is installed
where bun >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Bun is not installed. Please install it from https://bun.sh
    exit /b 1
)

:: Check if docker is installed
where docker >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Docker is not installed. Please install it from https://docker.com
    exit /b 1
)

:: Check if docker is running
docker info >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Docker is not running. Please start Docker Desktop and try again.
    exit /b 1
)

echo ✅ Prerequisites check passed

:: Install dependencies
echo 📦 Installing dependencies...
call bun install

:: Copy environment files
echo 📝 Setting up environment files...
if not exist apps\api\.env (
    copy apps\api\.env.example apps\api\.env
    echo ✅ Created apps\api\.env
)

if not exist apps\web\.env (
    copy apps\web\.env.example apps\web\.env
    echo ✅ Created apps\web\.env
)

:: Start Docker services
echo 🐳 Starting Docker services (PostgreSQL ^& Redis)...
docker-compose up -d

:: Wait for PostgreSQL to be ready
echo ⏳ Waiting for PostgreSQL to be ready...
timeout /t 5 /nobreak >nul

:: Run database migrations
echo 🗄️  Running database migrations...
cd apps\api
call bun run db:push
cd ..\..

echo.
echo ✅ Setup complete!
echo.
echo To start the development servers, run:
echo   bun run dev
echo.
echo Web app will be available at: http://localhost:5173
echo API will be available at: http://localhost:3000
echo.

pause
