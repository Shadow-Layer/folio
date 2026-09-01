# Town Ruins — System

Town Ruins is organized as separate frontend and backend applications connected through REST APIs. The repository also contains a Prisma/PostgreSQL data layer, external-service integrations, background notification processing, and deployment configuration.

## Frontend

The frontend is a React and TypeScript application using Material UI, Redux Toolkit, and Axios. The `frontend/package.json` manifest and `frontend/src/` tree provide the evidence for this layer.

## Persistence

Prisma connects the application to PostgreSQL 16. The schema and migration history show relational data modeling and versioned database changes. Application workflows use explicit status fields and transactional operations where the code requires state integrity.

## Service boundaries

The backend coordinates domain workflows, persistence, external payment and storage services, and asynchronous notifications. The architecture and API documentation record these boundaries and the main consumer-facing surfaces.

This document describes implemented structure. It does not claim a live production environment or particular deployment outcome.
