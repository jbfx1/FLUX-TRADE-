import { Pool } from 'pg';
import { env } from '../config/env';

export const pool = env.isTest
  ? undefined
  : new Pool({
      connectionString: env.databaseUrl,
      max: 10,
      ssl: env.isProduction ? { rejectUnauthorized: false } : undefined
    });
