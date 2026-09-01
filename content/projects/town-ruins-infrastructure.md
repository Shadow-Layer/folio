# Town Ruins — Infrastructure and Workers

The repository contains Dockerfiles and a Docker Compose configuration for PostgreSQL, MinIO, backend, frontend, and Nginx services. Nginx provides the reverse-proxy layer, while MinIO supplies local S3-compatible object storage configuration.

## Background processing

Notification work is queued through a notification service and processed by a worker. The backend also contains scheduled and operational scripts for tasks such as backups and reconciliation.

These artifacts describe a repeatable infrastructure and operational configuration. They do not establish a currently running public environment, uptime, or a specific AWS topology.
