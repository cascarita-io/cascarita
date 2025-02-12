setup:
	./setup.sh

restart:
	docker compose down --volumes --remove-orphans
	docker compose up -d

build:
	docker compose build --no-cache

database:
	docker compose exec server npm run migrate

test:
	cd server && npm run test

eslint:
	cd client && npm run eslint
