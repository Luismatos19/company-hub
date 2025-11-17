FROM node:20-alpine

# Install pnpm with specific version to avoid conflicts
RUN npm install -g pnpm@latest

WORKDIR /app

# Copy package files first
COPY package.json pnpm-lock.yaml ./

# Install all dependencies (dev + prod)
# This will be preserved by the anonymous volume /app/node_modules in docker-compose
RUN pnpm install --frozen-lockfile

EXPOSE 3000

# Start Next.js dev server (with HMR)
CMD ["pnpm", "dev"]


