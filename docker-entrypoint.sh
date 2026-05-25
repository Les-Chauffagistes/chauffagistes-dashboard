#!/bin/sh
set -e


# Injection des secrets
DB_PASS=$(cat /run/secrets/heatboard_staging_db_password)
export PGPASSWORD="${DB_PASS}"
export DATABASE_URL=postgresql://${DB_USER}:${DB_PASS}@${DB_HOST}:5432/${DB_NAME}
export POOL_TOKEN=$(cat /run/secrets/pool_token)
export SESSION_PASSWORD=$(cat /run/secrets/session_password)
export DISCORD_CLIENT_SECRET=$(cat /run/secrets/discord_client_secret)
export NEXTAUTH_SECRET=$(cat /run/secrets/nextauth_secret)

cat > public/config.js << CONF
window.__CONFIG__ = {
  BASE_URL: "${BASE_URL:-}",
  API_URL: "${API_URL:-}",
  HISTORY_API_URL: "${HISTORY_API_URL:-}",
  BITCOIN_API_URL: "${BITCOIN_API_URL:-}"
};
CONF

echo "Waiting migration flag..."
until [ -f /migrations/done ] && \
  [ "$(ls prisma/migrations/ | grep -v migration_lock.toml | sort | sha256sum | cut -d' ' -f1)" = "$(cat /migrations/done)" ]; do
  echo "Migration(s) not applied, retry..."
  sleep 2
done

echo "Migrations OK, starting..."
exec node server.js