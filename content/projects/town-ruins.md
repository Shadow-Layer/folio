# Town Ruins

Town Ruins is a real-estate marketplace platform. It is the primary evidence of systems engineering capability.

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
- **Prisma migrations** — Schema versioning

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

The project source and documentation are available in these verified repositories:

- **[Source code](https://github.com/hwevaproduction-debug/towruins):** frontend, backend, Prisma schema and migrations, Docker Compose configuration, and tests
- **[Project documentation](https://github.com/hwevaproduction-debug/TownRuins-Docs):** architecture, API, database, deployment, and operations documentation
- **[Operations knowledge system](https://github.com/hwevaproduction-debug/TownRuins-Operations):** runbooks, procedures, and Quartz knowledge content

## Evidence Level

**Working** — Implemented with deployment configuration, operational documentation, and supporting test and infrastructure artifacts.

The repository evidence supports the implementation and deployment-related configuration described here. It does not establish a publicly verifiable live production environment.

## Learn More

- **[Architecture documentation](https://github.com/hwevaproduction-debug/TownRuins-Docs):** architecture, API, database, deployment, and operations materials
- **[Operations knowledge system](https://github.com/hwevaproduction-debug/TownRuins-Operations):** operational procedures and supporting knowledge content
- **[Source code](https://github.com/hwevaproduction-debug/towruins):** application implementation and configuration
