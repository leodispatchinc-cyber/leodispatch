# syntax=docker/dockerfile:1
# Deterministic production build for the Leo Dispatch Next.js app.
# Railway auto-detects this Dockerfile and builds with it (bypassing the
# auto-builder), giving a reproducible image and a tiny runtime.

FROM node:22-alpine AS base
# libc6-compat keeps Next.js happy on Alpine
RUN apk add --no-cache libc6-compat
WORKDIR /app

# ---- deps: install from the lockfile ----
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# ---- builder: compile the Next.js app (standalone output) ----
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ---- runner: minimal image that serves the build ----
FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
# bind to all interfaces so Railway can route to the container
ENV HOSTNAME=0.0.0.0

# static assets + the self-contained server
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# file-based store lives here — mount a Railway volume at /app/.data to persist
RUN mkdir -p /app/.data

EXPOSE 3000
CMD ["node", "server.js"]
