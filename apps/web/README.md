# Flux Trader Web

Flux Trader Web is a Vite-powered React single-page application delivering the landing page and trading dashboard.

## Available pages

- **Landing page** (`/`) – marketing copy, call to action, compliance notice and partner disclosure.
- **Dashboard** (`/app`) – TradingView chart placeholder, order ticket and account summary widgets.
- **Callback** (`/callback`) – handles Deriv OAuth callbacks and redirects to the dashboard.

## TradingView integration

Request the TradingView Charting Library licence and host the bundle privately. Once obtained, place the library contents under `public/vendor/tradingview` **at runtime** (e.g. via a Docker volume). The application lazily loads the widget using `window.TradingView`. For development without the library, a placeholder panel is rendered.

## Scripts

```bash
npm run dev      # Start Vite dev server
npm run build    # Production build
npm run preview  # Preview built app
npm run test     # Run Vitest suite
```

Environment variables prefixed with `VITE_` are exposed to the client. See the repository `.env.example` for defaults.
