# Flux Trader Server

Flux Trader Server is an Express-based proxy that protects Deriv credentials, exposes a REST API for the SPA, and powers the TradingView datafeed.

## Key responsibilities

- Manage OAuth exchanges with Deriv and maintain user sessions.
- Aggregate Deriv ticks into OHLC candles for custom timeframes.
- Proxy trade requests (buy/sell) through a secure backend, storing positions in PostgreSQL.
- Provide account summaries including balance, open positions and realised P&L.
- Persist audit logs for compliance and monitoring.

## Scripts

```bash
npm run dev        # Start the API with hot reload
npm run build      # Compile TypeScript
npm run start      # Run the compiled build
npm run test       # Run Vitest unit/integration suite
npm run db:generate # Generate Prisma Client
npm run db:migrate  # Apply migrations in production
```

## Environment variables

Refer to the repository `.env.example` for all required variables. The server expects the Deriv OAuth application to redirect back to `/auth/callback` and will proxy WebSocket traffic using the configured `DERIV_APP_ID`.

## Datafeed architecture

The datafeed keeps a persistent WebSocket subscription to Deriv ticks and aggregates them into 1, 5 and 15 minute candles. Historical bootstrap requests are performed via the `/ticks_history` endpoint. The aggregated candles are exposed via `/datafeed/history` and conform to the TradingView Datafeed contract from the front-end.

## Security

- Sessions are stored server-side in PostgreSQL (except during tests where an in-memory store is used).
- Helmet and secure cookie settings are enabled by default.
- All outbound requests to Deriv use the short-lived OAuth tokens obtained during login.

## Testing

Vitest covers datafeed aggregation, order routing and account summary APIs. Extend the suite with mocks for Deriv endpoints when adding more contract types.
