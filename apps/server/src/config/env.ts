const required = (value: string | undefined, name: string): string => {
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
};

const PORT = Number(process.env.PORT ?? '8080');

export const env = {
  port: PORT,
  derivAppId: required(process.env.DERIV_APP_ID, 'DERIV_APP_ID'),
  derivRedirectUri: required(process.env.DERIV_REDIRECT_URI, 'DERIV_REDIRECT_URI'),
  derivApiToken: process.env.DERIV_API_TOKEN,
  databaseUrl: required(process.env.DATABASE_URL, 'DATABASE_URL'),
  sessionSecret: required(process.env.SESSION_SECRET, 'SESSION_SECRET'),
  logLevel: process.env.LOG_LEVEL ?? 'info',
  logFormat: process.env.LOG_FORMAT === 'json' ? 'combined' : 'dev',
  webOrigin: process.env.VITE_PUBLIC_URL ?? 'http://localhost:5173',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test'
};
