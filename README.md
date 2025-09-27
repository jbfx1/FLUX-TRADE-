# Flux Trader

Flux Trader is a production-ready trading platform that connects to Deriv contracts and delivers a responsive TradingView-powered user experience. This repository contains the front-end single-page application, the secure Node.js proxy, infrastructure as code, and documentation for deployment and future development.

## Repository structure

```
apps/
  server/        # Express + WebSocket proxy, session handling and Deriv integrations
  web/           # React single-page application for the landing page and trading dashboard
config/          # Environment and service configuration templates
infra/           # Docker, docker-compose and CI configuration
```

> **TradingView Library**  
> The TradingView Charting Library licence prohibits redistributing the library in a public repository. Store the library assets in a private bucket or package registry and mount them at runtime as described in [`apps/web/README.md`](apps/web/README.md).

## Getting started

1. Copy `.env.example` to `.env` and fill in secrets (Deriv app ID, OAuth client, session secrets, database credentials, etc.).
2. Install dependencies for each workspace:
   ```bash
   cd apps/server && npm install
   cd ../web && npm install
   ```
3. Start the development stack with Docker:
   ```bash
   docker compose up --build
   ```
4. Access the landing page at `http://localhost:5173` and the API at `http://localhost:8080`.

Refer to [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) for production guidance and [`apps/server/README.md`](apps/server/README.md) for backend details.
