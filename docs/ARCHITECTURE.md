# Architecture Overview

Flux Trader follows a three-tier architecture comprising:

1. **Front-end SPA (React + Vite)** – delivers the landing page and the authenticated dashboard. The TradingView Charting Library is dynamically loaded from a private location. The SPA communicates with the backend via HTTPS using the REST endpoints documented in [`apps/server`](../apps/server/README.md).
2. **Backend Proxy (Express + Prisma)** – stores secrets, manages OAuth flows, aggregates market data and proxies trading actions to Deriv. It also exposes a datafeed endpoint used by TradingView to request historical candles.
3. **PostgreSQL Database** – persists users, positions and audit logs. Session data is stored using `connect-pg-simple` for fault tolerance.

## Request Flow

1. The user lands on `fluxtrader.com` and initiates login via Deriv OAuth.
2. Deriv redirects back to `/callback` with an authorisation code. The SPA forwards the code to `/auth/exchange`.
3. The backend exchanges the code for OAuth tokens, stores them, and creates a session cookie.
4. TradingView requests candles by calling `/datafeed/history`. The backend fetches historical ticks (via REST) and streams live ticks (via WebSocket) from Deriv, aggregating them into candles.
5. Order placement uses `/trade/buy` with a Rise/Fall contract payload. Contract IDs are stored for subsequent `/trade/sell` calls.
6. Account summary widgets call `/account/summary`, which aggregates Deriv balance and portfolio endpoints with persisted position data.

## Data Models

See [`prisma/schema.prisma`](../apps/server/prisma/schema.prisma) for the full schema. Key entities include `User` (Deriv profile), `Position` (open contracts), and `AuditLog` (compliance trail).

## Security Considerations

- OAuth secrets, API tokens and session secrets are managed through environment variables and should be stored in a secrets manager in production.
- Helmet enforces secure HTTP headers while CORS is restricted to the SPA origin.
- WebSocket reconnection logic ensures resilience against transient network issues.
- Testing ensures datafeed aggregation and trade routing behave as expected without calling real Deriv services.
