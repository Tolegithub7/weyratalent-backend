SHELL := /bin/bash

# Default folder for export/import
FOLDER ?= backup

# Load environment variables from .env file
ifneq ("$(wildcard .env)","")
    include .env
    export
endif

help:
	@echo "Available commands:"
	@echo "devup                - Start docker containers with build and recreate only the api service"
	@echo "teardown             - Stop and remove docker containers"
	@echo "certbot              - Obtain SSL certificate with certbot"
	@echo "ssl-gen              - Generate self-signed SSL certificate"
	@echo "db-migrate-generate  - Generate a database migration (usage: make db-migrate-generate MIGRATION_NAME=YourMigrationName)"
	@echo "db-migrate-run       - Run all pending database migrations"
	@echo "db-migrate-rollback  - Rollback the last migration"
	@echo "dev                  - Start development environment (Docker + TypeScript watch)"
	@echo "lint-format          - Lint and format the codebase"
	@echo "export-db            - Export PostgreSQL database (usage: make export-db USER=<username> CONTAINER=<container_name> [FOLDER=<folder_path>])"
	@echo "import-db            - Import PostgreSQL database (usage: make import-db USER=<username> CONTAINER=<container_name> [FOLDER=<folder_path>])"

# Docker commands
devup:
	@echo "Starting Docker containers..."
	docker compose up --build --force-recreate -d api

teardown:
	@echo "Stopping and removing Docker containers..."
	docker-compose down

# SSL commands
certbot:
	@echo "Obtaining SSL certificate with certbot..."
	docker-compose run --rm certbot certonly --webroot --webroot-path=/var/www/certbot -d example.com -d www.example.com

ssl-gen:
	@echo "Generating self-signed SSL certificate..."
	mkdir -p ./nginx/certs && openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout ./nginx/certs/selfsigned.key -out ./nginx/certs/selfsigned.crt -subj "/CN=192.168.0.140"

lint-format:
	@echo "Linting and formatting the codebase..."
	npm run "lint:fix"
	npm run "format"

# Database commands
MIGRATION_NAME ?= DefaultMigrationName

db-migrate-generate:
	@if [ "$(MIGRATION_NAME)" = "DefaultMigrationName" ]; then \
		echo "Please provide a migration name: make db-migrate-generate MIGRATION_NAME=YourMigrationName"; \
		exit 1; \
	fi
	npm run typeorm migration:generate -- src/db/migrations/$(MIGRATION_NAME)

db-migrate-run:
	@echo "Running all pending database migrations..."
	npm run migration:run

db-migrate-rollback:
	@echo "Rolling back the last migration..."
	npm run migration:revert

# DB Import/Export commands
ERROR_MSG := "Error:"

export-db:
	@echo "Exporting PostgreSQL database..."
	@mkdir -p $(FOLDER)  # Ensure the folder exists
	@docker exec -t $(CONTAINER) pg_dumpall -c -U $(USER) | gzip > $(FOLDER)/dump_`date +%Y-%m-%d"_"%H_%M_%S`.sql.gz

export-db-default:
	@mkdir -p backup  # Ensure the backup folder exists
	@docker exec -t db pg_dumpall -c -U your_default_user | gzip > backup/dump_`date +%Y-%m-%d"_"%H_%M_%S`.sql.gz

import-db:
	@echo "Importing PostgreSQL database..."
	@mkdir -p $(FOLDER)  # Ensure the folder exists
ifndef FILE
	@echo "No FILE provided, importing the latest file from $(FOLDER)..."
	@LATEST_FILE=`ls -t $(FOLDER)/*.sql.gz | head -1`; \
	if [ -z "$$LATEST_FILE" ]; then \
		echo "No backup files found in $(FOLDER)"; \
		exit 1; \
	else \
		echo "Importing $$LATEST_FILE..."; \
		zcat $$LATEST_FILE | docker exec -i $(CONTAINER) psql -U $(USER) -d $(DB_NAME); \
	fi
else
	@echo "Importing from $(FILE)..."
	@zcat $(FILE) | docker exec -i $(CONTAINER) psql -U $(USER) -d $(DB_NAME)
endif

import-db-default:
	@mkdir -p backup  # Ensure the backup folder exists
	@LATEST_FILE=`ls -t backup/*.sql.gz | head -1`; \
	if [ -z "$$LATEST_FILE" ]; then \
		echo "No backup files found in backup"; \
		exit 1; \
	else \
		echo "Importing $$LATEST_FILE..."; \
		zcat $$LATEST_FILE | docker exec -i db psql -U your_default_user -d your_default_db; \
	fi

# Development
dev:
	@echo "Starting development environment (Docker + TypeScript watch)..."
	npm run dev
