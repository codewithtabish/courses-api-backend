# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

# Install dependencies
RUN npm install

COPY . .

# Compile TypeScript code
RUN npm run build

# Stage 2: Final Image
FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Use environment variable from .env
ENV NODE_ENV=production
ENV PORT=${PORT}

EXPOSE ${PORT}

CMD ["node", "dist/index.js"]
