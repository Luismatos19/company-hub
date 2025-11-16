# Build stage
FROM node:20-alpine AS builder

# Install pnpm with specific version to avoid conflicts
RUN npm install -g pnpm@latest

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies (this will also install TypeScript from devDependencies)
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Create public directory if it doesn't exist (Next.js expects it)
RUN mkdir -p public

# Build the application
RUN pnpm build

# Production stage
FROM node:20-alpine AS production

# Install pnpm with specific version to avoid conflicts
RUN npm install -g pnpm@latest

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install production dependencies, but also install TypeScript (needed for next.config.ts)
RUN pnpm install --prod --frozen-lockfile && pnpm add -D typescript || pnpm install --frozen-lockfile

# Copy built application from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/next.config.ts ./next.config.ts

# Create public directory (Next.js expects it, even if empty)
RUN mkdir -p public

# Expose port
EXPOSE 3000

# Start the application
CMD ["pnpm", "start"]

