# Deployment Guide

This guide summarises the steps required to deploy Flux Trader to a cloud environment.

## Prerequisites

- Docker and Docker Compose for building containers locally.
- Access to a PostgreSQL database cluster (managed services such as RDS, Cloud SQL, or Azure Database are recommended).
- A secrets manager for storing the Deriv OAuth credentials, API token, session secrets, and TradingView library artefacts.
- A domain (e.g. `fluxtrader.com`) with SSL certificates (Let's Encrypt via a reverse proxy such as Traefik or Cloudflare is recommended).
- CI/CD provider credentials (GitHub Actions configured in this repo).

## Build & Publish

1. Configure the `REGISTRY_URL`, `REGISTRY_USERNAME`, and `REGISTRY_PASSWORD` secrets in your CI environment.
2. Update `infra/docker-compose.prod.yml` with the registry image names and tag (default: `latest`).
3. Run the GitHub Actions workflow or execute locally:
   ```bash
   docker build -t fluxtrader-server -f infra/Dockerfile.server .
   docker build -t fluxtrader-web -f infra/Dockerfile.web .
   ```
4. Push the images to your registry and update your deployment manifests.

## Database migrations

1. Run `npm run db:migrate` inside `apps/server` (uses Prisma migrations) once the database credentials are set.
2. Seed reference data and create admin accounts via `npm run db:seed` if required.

## Infrastructure as Code

- For Kubernetes, translate `docker-compose.prod.yml` services into Deployment and Service manifests and mount secrets via environment variables.
- Configure a reverse proxy to terminate SSL and forward `/api` requests to the server while serving the static web build.

## Monitoring & Logging

- Enable structured logging (JSON) in production via the `LOG_FORMAT=json` environment variable.
- Export application metrics via the `/metrics` endpoint and scrape them with Prometheus.
- Push logs to a centralised stack (ELK, Loki, etc.) for compliance.

## TradingView Library

The TradingView Charting Library must be hosted privately. Upload the `charting_library` bundle to a secure object storage bucket and mount it at `/public/vendor/tradingview` during deployment. Do not commit the bundle to Git.

## Post-deployment checks

- Verify OAuth login redirects to Deriv and back to `https://app.fluxtrader.com/callback`.
- Place a test Rise/Fall contract and ensure confirmations appear.
- Check the landing page footer for the risk disclaimer and "Powered by Deriv" message.
- Confirm WebSocket reconnection logic handles network blips without manual reloads.
