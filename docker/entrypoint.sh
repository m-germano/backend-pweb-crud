#!/usr/bin/env sh
set -e

echo "[entrypoint] aguardando Postgres em $DATABASE_URL ..."
# Espera porta do host 'db:5432'
until wget -qO- http://db:5432 2>/dev/null | grep . >/dev/null; do
 
  sleep 2

  nc -z db 5432 && break || true
done

echo "[entrypoint] aplicando migrations..."
npx prisma migrate deploy

echo "[entrypoint] executando seed (idempotente se usar upsert)..."

npm run prisma.db.seed || true

echo "[entrypoint] iniciando servidor..."
node dist/server.js
