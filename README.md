# Vehicle Management App

This is a small vehicle management application that exposes a REST API for managing vehicles. It uses Sequelize (with `sequelize-typescript`) as the ORM and MySQL as the database. The repository includes a `vehicles.json` file used as seed data.

## Features
- CRUD operations for vehicles (see `/vehicles` endpoints)
- Simple validation via the Sequelize model (status enum and license plate rules)
- A TypeScript seeder that reads `vehicles.json` and inserts records into the MySQL database

## Prerequisites
- Node.js (v16+ recommended)
- npm
- Docker & Docker Compose (to start the MySQL container)

## Quickstart

1. Clone the repository and change into the project folder.

2. Start the MySQL database via Docker Compose:

```powershell
docker compose up -d
```

The included `docker-compose.yaml` starts the MySQL service used by the app. By default the DB name expected by the app is `vehicle_management` (you can override via `.env`).

3. Create a `.env` file in the project root with your DB credentials. Example:

```powershell
# .env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=example
DB_NAME=vehicle_management
PORT=3000
```

4. Install dependencies:

```powershell
npm install
```

5. Seed the database with sample vehicles (reads `vehicles.json`):

```powershell
npm run seed
```

Notes:
- The `seed` npm script is prefixed with `dotenv --`, so it will load `.env` automatically.
- The seeder checks for existing `license_plate` values and skips inserting duplicates.

6. Start the application (development):

```powershell
npm run dev
```

The app will run on `http://localhost:3000` by default (or the `PORT` in `.env`).

You can also run the seeder automatically when the server starts by setting `SEED_DB=true` in your environment before starting the server:

```powershell
$env:SEED_DB = "true"
npm run dev
```

## API Endpoints (examples)
- GET /vehicles — list vehicles
- GET /vehicles/:id — get a single vehicle
- POST /vehicles — create a vehicle
- PUT /vehicles/:id — update a vehicle
- DELETE /vehicles/:id — delete a vehicle

Quick verification using PowerShell:

```powershell
# List vehicles
Invoke-RestMethod -Uri http://localhost:3000/vehicles
```

## Swagger (API docs)

Interactive API documentation is available when the app is running at `/api-docs`.
The app mounts Swagger UI using `swagger-ui-express` and the OpenAPI spec is generated from the JSDoc comments in the route files (see `src/swagger.ts`).

- In a browser: http://localhost:3000/api-docs
- The UI lets you explore endpoints and try requests directly from the browser.

## Implementation notes
- The Sequelize model is defined in `src/data/models/Vehicle.ts`. It uses `license_plate` (unique) and a status enum (`Available`, `InUse`, `Maintenance`).
- The repository is in `src/data/repository` and wraps the model operations.
- The seeder is `src/seed.ts` and reads `vehicles.json` in the repository root.
- The app calls `sequelize.sync()` on startup to ensure tables are created.

## Tests

Run the test suite with:

```powershell
npm test
```

## Troubleshooting
- Database connection errors: check your `.env` values and ensure the MySQL container is running (`docker compose ps`).
- Port conflicts: change `PORT` in `.env`.
- If the seeder inserts nothing, verify the license plates in `vehicles.json` are not already present in your DB (the seeder skips duplicates).

## API Documentation (Swagger)

The application exposes a Swagger UI when the server is running so you can explore and test the API.

- Swagger UI: http://localhost:3000/api-docs

Examples:
- Open in a browser: navigate to http://localhost:3000/api-docs
- Fetch the OpenAPI JSON (PowerShell):

If you changed PORT in `.env`, replace 3000 with your configured port. The docs are available only while the server is running.
