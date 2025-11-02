# =========================
#  Dependencies + Prisma
# =========================
FROM node:20-alpine AS deps
WORKDIR /app

RUN apk add --no-cache bash wget openssl

# Copia manifests e instala deps
COPY package*.json ./
COPY prisma.config.ts ./
COPY prisma ./prisma
RUN npm ci

# ✅ Placeholder para satisfazer prisma.config.ts no build
ENV DATABASE_URL="postgresql://postgres:postgres@db:5432/projetoPweb?schema=public"

# Gera Prisma Client (não conecta no banco)
RUN npx prisma generate

# =========================
#  Build (TypeScript -> dist)
# =========================
FROM node:20-alpine AS build
WORKDIR /app

# Precisamos do package.json aqui também para npm scripts de build
COPY package*.json ./
COPY --from=deps /app/node_modules ./node_modules

COPY tsconfig*.json ./
COPY src ./src
COPY prisma ./prisma
COPY prisma.config.ts ./

RUN npm run build

# =========================
#  Runtime
# =========================
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production

# nc (netcat) para wait-for-db, curl para healthcheck
RUN apk add --no-cache netcat-openbsd curl

# ⬇⬇ Necessário para 'npm run prisma.db.seed'
COPY package*.json ./

# Copia node_modules com Prisma gerado, dist e prisma
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY prisma ./prisma
COPY prisma.config.ts ./

# Entry para migrar/seed e subir a API
COPY docker/entrypoint.sh /entrypoint.sh
# normaliza EOL + permissão
RUN sed -i 's/\r$//' /entrypoint.sh && chmod +x /entrypoint.sh

EXPOSE 3333
CMD ["/entrypoint.sh"]
