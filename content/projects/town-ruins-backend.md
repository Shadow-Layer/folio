# Town Ruins — Backend

The backend is a Node.js/Express application. Its controllers and routes cover authentication, listings, bookings, stays, payments, uploads, notifications, providers, reviews, reports, disputes, moderation, and webhooks.

## Workflow model

Prisma-backed controllers represent marketplace state through users, properties, listings, bookings, stays, payments, notifications, and moderation records. Validation and error-handling middleware are part of the request path.

The API documentation describes the public domain groupings and request/response surfaces. The source repository contains the implementation under `backend/app.js`, `backend/controllers/`, route modules, and `backend/prisma/schema.prisma`.

This is evidence of implemented backend behavior, not a claim about traffic, uptime, or production adoption.
