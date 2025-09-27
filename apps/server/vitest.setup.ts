process.env.DATABASE_URL = process.env.DATABASE_URL ?? 'postgresql://user:pass@localhost:5432/test';
process.env.SESSION_SECRET = process.env.SESSION_SECRET ?? 'test';
process.env.DERIV_APP_ID = process.env.DERIV_APP_ID ?? '9999';
process.env.DERIV_REDIRECT_URI = process.env.DERIV_REDIRECT_URI ?? 'http://localhost/callback';
process.env.VITE_PUBLIC_URL = process.env.VITE_PUBLIC_URL ?? 'http://localhost:5173';
