# ---- Stage 1: build ----
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies (using cache)
COPY package.json package-lock.json .npmrc* ./ 

RUN npm ci

# Copy code and build
COPY . .

RUN npm run build

# ---- Stage 2: runtime (Caddy) ----
FROM caddy:2-alpine

ARG PORT=8080
ENV PORT=$PORT

COPY --from=builder /app/dist /srv

COPY ./Caddyfile /etc/caddy/Caddyfile

# Caddy exposes 80 and 443 by default
