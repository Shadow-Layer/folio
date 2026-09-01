# Town Ruins

Town Ruins is a full-stack real-estate marketplace. It is the portfolio's deepest project because the available source and documentation cover application behavior, persistence, deployment configuration, and operations.

## Overview

The system supports a marketplace in which tenants search and book temporary stays while landlords manage properties. Alvin's documented contribution is software engineering across application code, backend routes and business logic, database-backed workflows, deployment configuration, and operational tooling.

The evidence establishes implemented work; it does not establish live production status or business outcomes. Use the navigation below to inspect the system, backend, access-control, infrastructure, and evidence layers separately.

## Product layer

The repository models these marketplace domains:

- Users with distinct Admin, Landlord, Tenant, and Provider roles
- Property and listing lifecycle workflows
- Bookings and stays, including availability and cancellation behavior
- Payments, webhooks, reconciliation, and a transaction ledger/wallet model
- Notifications, reviews, reports, disputes, and moderation workflows

These are implemented capabilities visible in the backend controllers, routes, Prisma schema, and frontend application. No user counts, transaction volumes, revenue, or adoption outcomes are claimed.

## Decisions and lessons

The repository demonstrates implementation decisions, but it does not consistently preserve the original reasoning behind every decision. The defensible conclusions are therefore limited:

- A multi-domain marketplace is implemented with separate frontend, backend, persistence, and integration boundaries.
- Payment and notification failure modes are represented through provider abstractions, webhooks, reconciliation logic, and a notification worker.
- Docker Compose describes repeatable local service composition for the database, object storage, applications, and Nginx.

These are implementation observations, not reconstructed motivations where the source does not record them.

## Evidence level

**Working** — The available artifacts establish substantial implemented software and infrastructure experience. They do not establish a publicly verifiable live production environment, user adoption, or operational metrics.
