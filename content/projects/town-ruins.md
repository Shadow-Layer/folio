# Town Ruins

Town Ruins is a full-stack real-estate marketplace. It is the portfolio's deepest project because the available source and documentation cover application behavior, persistence, deployment configuration, and operations.

## Overview

The system supports a marketplace in which tenants search and book temporary stays while landlords manage properties. The implementation spans frontend, backend, database, authentication, payments, notifications, moderation, and supporting infrastructure.

Alvin's documented contribution is software engineering across those layers: application code, backend routes and business logic, database-backed workflows, deployment configuration, and operational tooling. The evidence establishes implemented work; it does not establish live production status or business outcomes.

## Product layer

The repository models the core marketplace domains:

- Users with distinct Admin, Landlord, Tenant, and Provider roles
- Property and listing lifecycle workflows
- Bookings and stays, including availability and cancellation behavior
- Payments, webhooks, reconciliation, and a transaction ledger/wallet model
- Notifications, reviews, reports, disputes, and moderation workflows

These are implemented capabilities visible in the backend controllers, routes, Prisma schema, and frontend application. No user counts, transaction volumes, revenue, or adoption outcomes are claimed.

## System layer

### Frontend

The frontend is a React and TypeScript application using Material UI, Redux Toolkit, and Axios. Its package manifest and `frontend/src/` tree are the evidence for this layer.

### Backend and APIs

The backend is a Node.js/Express application. Controllers and routes cover authentication, listings, bookings, stays, payments, uploads, notifications, providers, reviews, reports, disputes, moderation, and webhooks. The API documentation describes the public domain groupings and request/response surfaces.

### Data and state

Prisma connects the application to PostgreSQL 16. The schema and migration history provide evidence for relational data modeling and versioned database changes. Application workflows use explicit status fields and transactional operations where the code requires state integrity.

### Authentication and authorization

The backend implements JWT authentication, password hashing with bcryptjs, role-aware routes, and ownership checks for provider, landlord, tenant, and administrative operations. These claims are grounded in `authController.js`, route middleware, and the relevant controllers.

### Integrations

The code includes Paynow and Stripe payment providers, webhook handling, AWS S3-compatible storage through the AWS SDK, MinIO configuration for local object storage, and Africa's Talking notification integration. The repository also contains notification workers and supporting email/SMS channel code.

## Engineering layer

### Architecture

The project is organized as separate frontend and backend applications connected through REST APIs. The backend coordinates domain workflows, Prisma persistence, external payment/storage services, and asynchronous notifications. The architecture documentation records these boundaries and the API documentation records the main consumer-facing surfaces.

### Background processing

Notification work is queued through a notification service and processed by a worker. The backend also contains scheduled/operational scripts for tasks such as backups and reconciliation. These claims describe code and configuration present in the repository, not an uptime guarantee.

### Testing and validation

The backend includes unit and integration tests, and the repository contains end-to-end test material. Validation and error-handling middleware are part of the application request path.

## Infrastructure

The repository contains Dockerfiles and a Docker Compose configuration for PostgreSQL, MinIO, backend, frontend, and Nginx services. Nginx provides the reverse-proxy layer. Environment files and deployment manifests show configuration for different deployment contexts; they do not by themselves prove a currently running public environment.

Linux and cloud infrastructure are part of the supplied professional background and project deployment context. This portfolio does not claim a specific AWS topology, region, availability target, or managed database service beyond the AWS SDK/S3 integration evidenced in the code.

## Decisions and lessons

The repository demonstrates implementation decisions, but it does not consistently preserve the original reasoning behind every decision. The defensible conclusions are therefore limited:

- **Problem:** A multi-domain marketplace needs boundaries between UI, API, persistence, and external services.
  **Implementation:** Separate React frontend, Express backend, Prisma/PostgreSQL data layer, and integration modules.
  **Consequence:** Each layer can be inspected and deployed as a distinct part of the system.

- **Problem:** Payment providers and asynchronous notifications have different failure modes.
  **Implementation:** Provider abstractions, webhook handlers, reconciliation logic, and a notification worker.
  **Consequence:** Payment and notification behavior is represented as explicit application workflows rather than only UI actions.

- **Problem:** Deployment needs repeatable local service composition.
  **Implementation:** Docker Compose definitions for database, object storage, applications, and Nginx.
  **Consequence:** The repository contains a reproducible infrastructure description without claiming a live deployment outcome.

These are implementation observations, not reconstructed motivations where the source does not record them.

## Evidence

- [Source repository](https://github.com/hwevaproduction-debug/towruins): frontend, backend, schema, migrations, tests, and deployment configuration
- [Architecture and API documentation](https://github.com/hwevaproduction-debug/TownRuins-Docs): system boundaries, API domains, database, deployment, and operations references
- [Operations knowledge system](https://github.com/hwevaproduction-debug/TownRuins-Operations): runbooks, procedures, and operational documentation

Useful repository artifacts include `backend/app.js`, `backend/controllers/`, `backend/prisma/schema.prisma`, `backend/utils/notificationWorker.js`, `backend/utils/paymentProvider.js`, `docker-compose.yml`, `frontend/package.json`, and `backend/tests/`.

## Evidence level

**Working** — The available artifacts establish substantial implemented software and infrastructure experience. They do not establish a publicly verifiable live production environment, user adoption, or operational metrics.
