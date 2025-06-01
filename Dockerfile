# ---- Build Stage ----
FROM node:24-slim AS builder

WORKDIR /app

# Copy dependencies and install them
COPY package*.json ./
RUN npm ci

# Copy the rest of the app and build it
COPY . .
RUN npm run build

# ---- Runtime Stage ----
FROM node:24-slim

WORKDIR /app

# Only copy built files and dependencies
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/build ./build

# Start the app
CMD ["node", "build/bot.js"]