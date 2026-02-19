# ── Etapa 1: Build ──────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Instalar dependencias (aprovecha caché de Docker)
COPY package*.json ./
RUN npm ci

# Copiar fuentes y compilar
COPY . .
RUN npm run build

# ── Etapa 2: Producción ─────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

# Copiar los artefactos del build (dist/) y los node_modules necesarios para el servidor SSR
COPY --from=builder /app/dist/savings-frontend ./dist/savings-frontend
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Puerto expuesto (Railway inyecta la variable PORT automáticamente)
EXPOSE 4000

# El servidor SSR generado por Angular (entry point)
CMD ["node", "dist/savings-frontend/server/server.mjs"]
