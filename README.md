# BITS Hackathon Hub

React (Vite + TypeScript) frontend and Spring Boot backend with MySQL.

## Prerequisites

- Node.js 18+
- Java 17+
- Maven 3.8+
- MySQL 8

## Database

Create database `bits_hackathon_hub` (or rely on JDBC `createDatabaseIfNotExist` in the default URL). Schema and seed data load from:

- `backend/src/main/resources/schema.sql`
- `backend/src/main/resources/data.sql`

Optional extended SQL (triggers, procedures, views): `backend/src/main/resources/dbms_schema.sql` — run manually in MySQL if needed.

## Backend (local)

From the `backend` directory:

**PowerShell**

```powershell
$env:DB_USERNAME = "root"
$env:DB_PASSWORD = "<your-mysql-password>"
mvn spring-boot:run
```

**Command Prompt**

```cmd
set DB_USERNAME=root
set DB_PASSWORD=<your-mysql-password>
mvn spring-boot:run
```

Defaults are in `backend/src/main/resources/application.properties`; override with `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET`, `JWT_EXPIRATION` as needed.

API base URL: `http://localhost:8080/api`

## Frontend (local)

From the repository root:

```bash
npm install
npm run dev
```

App: `http://localhost:5173` — Vite proxies `/api` to `http://localhost:8080`.

Copy `.env.example` to `.env` for local overrides. For production builds, set `VITE_API_URL` to your deployed backend origin (no trailing slash path issues: use full URL like `https://api.example.com`).

## Production frontend (Vercel)

- Build command: `npm run build`
- Output directory: `dist`
- Set environment variable `VITE_API_URL` to your public Spring Boot API URL.

## Build checks

```bash
npm run build
cd backend && mvn -DskipTests package
```
