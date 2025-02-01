#!/bin/bash

set -e

# Create test database by connecting to default postgres database
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "postgres" <<-EOSQL
    CREATE DATABASE "${POSTGRES_DB}_test";
EOSQL

echo "Created database: ${POSTGRES_DB}_test"
