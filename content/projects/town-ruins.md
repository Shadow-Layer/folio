# Town Ruins

Town Ruins is a production-grade real-estate marketplace platform. It is the primary evidence of systems engineering capability.

## What It Is

A rental housing marketplace built with React, Node.js, PostgreSQL, and Docker. Tenants search and book temporary stays; landlords manage properties. The system handles payments, notifications, moderation, and operational infrastructure for a multi-stakeholder platform.

## What It Demonstrates

### Application Engineering

- Full-stack development (frontend, backend, database)
- User authentication (JWT + bcrypt)
- Role-based access control (Admin, Landlord, Tenant, Provider)
- Complex data modeling (listings, bookings, stays, payments, moderation)
- State management across frontend and backend

### Infrastructure & Operations

- Containerized deployment (Docker + Docker Compose)
- Reverse proxy configuration (Nginx)
- Database migrations and versioning (Prisma)
- Object storage integration (S3/MinIO)
- Background worker systems (notifications, backups)
- Environment-based configuration

### Integration & Payments

- Multiple payment gateway integration (Paynow, Stripe)
- Webhook handling (payment reconciliation)
- Payment abstraction layer (pluggable providers)
- Transaction ledger and wallet system

### Reliability & Testing

- Unit tests (15+ test files)
- Integration tests (controller tests)
- End-to-end tests (E2E test suite)
- Database backup automation
- Error handling and validation

### Knowledge Systems

- Comprehensive technical documentation (TownRuins-Docs)
- Operational runbooks and procedures (TownRuins-Operations)
- Architecture decision records
- Deployment procedures
- Environment configuration reference

## Technology Stack (Verified)

### Frontend

- **React** 18.2.0 — UI framework with hooks
- **TypeScript** — Type-safe JavaScript
- **Material UI** 5.14.18 — Component library
- **Redux Toolkit** — State management
- **Axios** — HTTP client

### Backend

- **Node.js** — JavaScript runtime
- **Express** 4.18.2 — Web framework
- **Prisma** 5.0.0 — ORM and database client
- **bcryptjs** — Password hashing
- **jsonwebtoken** — JWT authentication

### Database

- **PostgreSQL** 16 — Relational database
- **Prisma migrations** — Schema versioning (50+ migrations)

### Infrastructure

- **Docker** + **Docker Compose** — Containerization and orchestration
- **Nginx** — Reverse proxy
- **MinIO** — S3-compatible object storage
- **AWS SDK** — S3 integration

### Integrations

- **Paynow** — Zimbabwean payment gateway
- **Stripe** — International payments
- **Africa Talking** — SMS and email notifications

## Architecture Overview

```
Frontend (React + TypeScript)
    ↓ REST API
Backend (Express + Prisma)
    ↓ SQL
PostgreSQL Database
    ↓
Background Workers (Notifications, Backups)
    ↓
External Services (Payment gateways, SMS/Email)
```

**Key Services:**

- Authentication service (JWT flow)
- Listing and booking engine
- Payment processing (Paynow + Stripe)
- Notification system (email, SMS)
- Moderation and admin tools
- File upload handling (S3/MinIO)

## Role and Responsibilities

**Application Development:** Implemented frontend UI, backend routes, database schema, business logic for listings, bookings, and payments.

**Infrastructure:** Configured Docker containers, Nginx reverse proxy, environment management, deployment targets.

**Operations:** Designed backup system, notification workers, payment reconciliation, admin moderation interface.

**Documentation:** Established canonical architecture documentation and operational runbooks.

## Evidence and Artifacts

All technical claims above are verifiable in:

- **Repository:** `/mnt/c/Users/dell/Documents/GitHub/towruins/`
- **Frontend source:** `frontend/src/` (React + TypeScript)
- **Backend source:** `backend/` (Express server)
- **Database:** `backend/prisma/schema.prisma` (50+ migrations)
- **Deployment:** `docker-compose.yml` (full multi-service setup)
- **Documentation:** `/TownRuins-Docs/` (architecture, API, operations)
- **Operations:** `/TownRuins-Operations/` (runbooks, procedures, Quartz knowledge system)
- **Tests:** `backend/tests/` (unit, integration, E2E)

## Evidence Level

**Proven** — Built, deployed, and operational in production.

This is not speculative. Every claim in this document is supported by actual repository artifacts, deployed code, and comprehensive documentation.

## Learn More

- **Architecture:** See `/TownRuins-Docs/architecture/ARCHITECTURE.md`
- **API Reference:** See `/TownRuins-Docs/api/API.md`
- **Database Design:** See `/TownRuins-Docs/database/`
- **Operations:** See `/TownRuins-Operations/docs/operations/`
- **Source Code:** Visit `/towruins/` repository