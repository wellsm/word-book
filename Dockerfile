# ---- Stage 1: build ----
FROM node:22-alpine AS builder

WORKDIR /app

# Instala dependências (aproveitando cache)
COPY package.json package-lock.json .npmrc* ./ 

RUN npm ci

# Copia código e builda
COPY . .

RUN npm run build

# ---- Stage 2: runtime (Caddy) ----
FROM caddy:2-alpine

ARG PORT=8080
ENV PORT=$PORT

COPY --from=builder /app/dist /srv

COPY ./Caddyfile /etc/caddy/Caddyfile

# Caddy expõe 80 e 443 por padrão
