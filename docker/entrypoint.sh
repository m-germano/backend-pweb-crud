#!/usr/bin/env sh
set -e

echo "[entrypoint] aguardando Postgres em db:5432..."
until nc -z db 5432; do
  sleep 2
done

echo "[entrypoint] aplicando migrations..."
npx prisma migrate deploy

echo "[entrypoint] executando seed (idempotente)..."
# tenta via script do package.json; se não houver, tenta tsx direto; se nada der, segue o fluxo
npm run prisma.db.seed || npx tsx prisma/seed.ts || true


SERVER_JS="dist/server.js"
if [ ! -f "$SERVER_JS" ] && [ -f "dist/src/server.js" ]; then
  SERVER_JS="dist/src/server.js"
fi

if [ ! -f "$SERVER_JS" ]; then
  echo "[entrypoint] ERRO: arquivo de entrada do servidor não encontrado."
  echo "[entrypoint] Conteúdo de dist/:"
  ls -R dist || true
  exit 1
fi

echo "[entrypoint] iniciando servidor com $SERVER_JS ..."
node "$SERVER_JS"
