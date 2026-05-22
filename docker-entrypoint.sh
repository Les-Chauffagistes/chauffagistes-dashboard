#!/bin/sh
set -e

export DATABASE_URL=postgresql://${DB_USER}:$(cat /run/secrets/db_password)@${DB_HOST}:5432/${DB_NAME}

echo "Waiting migration flag..."
until [ -f /migrations/done ] && \
  [ "$(ls prisma/migrations/ | grep -v migration_lock.toml | sort | sha256sum | cut -d' ' -f1)" = "$(cat /migrations/done)" ]; do
  echo "Migration(s) not applied, retry..."
  sleep 2
done

echo "Migrations OK, starting..."
exec node server.js