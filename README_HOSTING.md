# Local Demo Guide: BITS Hackathon Hub

This project is now set up for a simple college-demo workflow:

- Frontend showcase: Vercel can host the React app as a static frontend.
- Full functionality demo: run React, Spring Boot, and MySQL locally.
- Database focus: MySQL remains the source of truth for backend features.

## Local Services

```text
React frontend:      http://localhost:5173
Spring Boot backend: http://localhost:8080/api
MySQL database:      localhost:3306/bits_hackathon_hub
```

## 1. Start MySQL

Start your local MySQL server and create the database if needed:

```sql
CREATE DATABASE IF NOT EXISTS bits_hackathon_hub;
```

The backend is configured in `backend/src/main/resources/application.properties` to use:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/bits_hackathon_hub?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=root_password
```

Change `spring.datasource.password` to match your local MySQL password.

## 2. Run Backend Locally

```powershell
cd backend
mvn spring-boot:run
```

The backend runs on:

```text
http://localhost:8080/api
```

`schema.sql` and `data.sql` are used for manual SQL schema management. JPA schema auto-update is disabled.

## 3. Run Frontend Locally

```powershell
npm run dev
```

Open:

```text
http://localhost:5173
```

The frontend currently uses mock data for the Vercel/frontend showcase. When backend integration resumes, point API calls to:

```env
VITE_API_URL=http://localhost:8080/api
```

## 4. Vercel Frontend-Only Showcase

Vercel only needs to build the React app:

```text
Build command: npm run build
Output directory: dist
```

No hosted backend is required for the current frontend-only showcase.
