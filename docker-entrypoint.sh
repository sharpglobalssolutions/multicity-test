#!/bin/sh
set -e

# Applies any migrations that haven't run yet against the configured
# database — safe to run on every container start (a no-op once the schema
# is current). Seeding (`npm run prisma:seed`) is deliberately NOT run here:
# it's a one-off setup step, run manually against a fresh database.
echo "Running database migrations..."
npx prisma migrate deploy

echo "Starting application..."
exec "$@"
