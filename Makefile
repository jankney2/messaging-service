.PHONY: setup run test clean help db-up db-down db-logs db-shell db-seed

help:
	@echo "Available commands:"
	@echo "  setup    - Set up the project environment and start all services"
	@echo "  run      - Run the application"
	@echo "  test     - Run tests"
	@echo "  clean    - Clean up temporary files and stop containers"
	@echo "  db-up    - Start the PostgreSQL database"
	@echo "  db-down  - Stop the PostgreSQL database"
	@echo "  db-logs  - Show database logs"
	@echo "  db-shell - Connect to the database shell"
	@echo "  db-seed  - Seed the database"
	@echo "  help     - Show this help message"

setup:
	@echo "Setting up the project..."
	@docker-compose down -v
	@docker-compose build
	@docker-compose up -d
	@echo "Waiting for services to be ready..."
	@sleep 5
	@echo "Running database migrations..."
	@docker-compose exec -T postgres psql -U postgres -d messaging_service < init.sql/seed.sql
	@echo "Setup complete! App is running at http://localhost:8080"

run:
	@echo "Running the application..."
	@docker-compose up app

test:
	@echo "Running tests..."
	@docker-compose up -d
	@sleep 3
	@docker-compose exec app npm test

clean:
	@echo "Cleaning up..."
	@docker-compose down -v
	@echo "Removing any temporary files..."
	@rm -rf *.log *.tmp

db-up:
	@echo "Starting PostgreSQL database..."
	@docker-compose up -d postgres

db-down:
	@echo "Stopping PostgreSQL database..."
	@docker-compose stop postgres

db-logs:
	@echo "Showing database logs..."
	@docker-compose logs -f postgres

db-shell:
	@echo "Connecting to database shell..."
	@docker-compose exec postgres psql -U postgres -d messaging_service

db-seed:
	@echo "Seeding database..."
	@docker-compose exec -T postgres psql -U postgres -d messaging_service < init.sql/seed.sql