# Use Bun base image
FROM oven/bun:1 as base
WORKDIR /app

# Install dependencies
FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lockb /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# Build the app
FROM base AS build
COPY --from=install /temp/dev/node_modules node_modules
COPY . .
RUN bun run build

# Production image
FROM base AS release
COPY --from=install /temp/dev/node_modules node_modules
COPY --from=build /app/dist dist
COPY --from=build /app/package.json .

# Expose port
EXPOSE 8080

# Run the app
CMD ["bun", "run", "start"]
