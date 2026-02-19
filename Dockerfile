# ── Etapa 1: Build ──────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# ARG para recibir la URL del backend desde Railway (variable de entorno de build)
ARG BACKEND_URL=https://savings-backend-production.up.railway.app

# Instalar dependencias
COPY package*.json ./
RUN npm ci

# Copiar fuentes
COPY . .

# Sobreescribir environment.ts con la URL correcta antes de compilar
RUN echo "export const environment = { production: true, backendHost: '${BACKEND_URL}' };" > src/environments/environment.ts

# Compilar
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
