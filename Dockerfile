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

ENV NODE_ENV=production

EXPOSE 9000

CMD ["node", "dist/index.js"]
