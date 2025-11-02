# =========================
#  Dependencies + Prisma
# =========================
FROM node:20-alpine AS deps
WORKDIR /app

# Instala utilitários
RUN apk add --no-cache bash wget openssl

# Copia manifests e instala deps
COPY package*.json ./
COPY prisma.config.ts ./
COPY prisma ./prisma
RUN npm ci

# Gera Prisma Client (usa DATABASE_URL apenas em runtime; generate não conecta)
RUN npx prisma generate

# =========================
#  Build (TypeScript -> dist)
# =========================
FROM node:20-alpine AS build
WORKDIR /app

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

# Copia node_modules com Prisma gerado, dist e prisma
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY prisma ./prisma
COPY prisma.config.ts ./

# Entry para migrar/seed e subir a API
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 3333
CMD ["/entrypoint.sh"]
