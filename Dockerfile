# Stage 1: Build
FROM node:18-alpine AS builder

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install both production and development dependencies
RUN npm install

# Copy the rest of the code
COPY . .

# Compile TypeScript code
RUN npm run build

# Stage 2: Final Image
FROM node:18-alpine

# Set the working directory in the final image
WORKDIR /app

# Copy the built files from the builder stage
COPY --from=builder /app/dist ./dist

# Copy only the necessary files for production
COPY --from=builder /app/package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Set environment variable
ENV NODE_ENV=production

# Expose the application’s port
EXPOSE 9000

# Command to run your application
CMD ["node", "dist/index.js"]
