# CRM Backend API

## Overview

The **CRM Backend API** is a server-side application built with **NestJS**, **Knex.js**, and **PostgreSQL**. This project is designed to handle customer relationship management functionalities, providing RESTful API endpoints for managing contacts, users, and other CRM-related data.

## Features

- Built with **NestJS** for scalable and maintainable backend development.
- Uses **Knex.js** as the query builder for PostgreSQL database operations.
- Dockerized for easy deployment with `docker-compose`.
- Automatic database migrations on startup.
- Structured module-based architecture following NestJS best practices.

## Folder Structure

```
CRM/
├── src/
│   ├── app/
│   │   ├── modules/contact/
│   │   │   ├── controller/
│   │   │   ├── services/
│   │   │   ├── types/
│   │   ├── app.controller.ts
│   │   ├── app.module.ts
│   │   ├── app.service.ts
│   ├── config/knex_orm/
│   │   ├── knex.config.ts
│   │   ├── knex.module.ts
│   ├── core/
│   │   ├── services/sql.service.ts
│   │   ├── core.module.ts
│   ├── database/
│   │   ├── migrations/
│   │   ├── seeds/
│   │   ├── db-singleton-connection.ts
│   ├── shared/
│   │   ├── enums/
│   │   ├── interfaces/
│   │   ├── main.ts
│
├── .env
├── Dockerfile
├── docker-compose.yml
├── package.json
├── README.md
```

## Installation

### Prerequisites

Ensure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (>= 18.x.x)
- [Docker](https://www.docker.com/) & Docker Compose
- [PostgreSQL](https://www.postgresql.org/)

### Setup

1. Clone the repository:
   ```sh
   git clone https://github.com/ahmedHamed012/eduncy-crm-assessment.git
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file in the root directory and configure your environment variables:
   ```sh
   NODE_ENV=dev
   PORT=5000
   DATABASE_URL="postgresql://postgres:hamed@localhost:5432/eduncy_crm"
   DATABASE_NAME=eduncy_crm
   DATABASE_USER=postgres
   DATABASE_PASSWORD=hamed
   DATABASE_HOST=postgres
   DATABASE_PORT=5432
   ```

## Running the Project

### Without Docker

```sh
npm run start:dev
```

### With Docker

1. Build and start the application using Docker Compose:
   ```sh
   docker-compose up --build
   ```
2. To run in detached mode:
   ```sh
   docker-compose up -d
   ```

## Database Migrations

### Running Migrations

```sh
npm run migrate:latest
```

### Creating a New Migration

```sh
npm run migrate:make migration_name
```

### Rolling Back the Last Migration

```sh
npm run migrate:rollback
```

### Seeding Some Data To The Database For Efficiency Test

```sh
npm run seed:run
```

## Testing

Run unit tests:

```sh
npm run test
```
