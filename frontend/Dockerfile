FROM node:20-alpine

# Install pnpm with specific version to avoid conflicts
RUN npm install -g pnpm@latest

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install all dependencies (dev + prod)
RUN pnpm install --frozen-lockfile

# Em desenvolvimento, o código-fonte é montado via volume (./frontend:/app)

EXPOSE 3000

# Start Next.js dev server (with HMR)
CMD ["pnpm", "dev"]


