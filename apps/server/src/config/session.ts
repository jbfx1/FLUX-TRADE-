import session from 'express-session';
import connectPgSimple from 'connect-pg-simple';
import { env } from './env';
import { pool } from '../db/pool';

const PgSession = connectPgSimple(session);

const store = env.isTest
  ? undefined
  : new PgSession({
      pool: pool!,
      tableName: 'session'
    });

export const sessionConfig: session.SessionOptions = {
  store,
  name: 'flux.sid',
  secret: env.sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: env.isProduction,
    httpOnly: true,
    sameSite: env.isProduction ? 'strict' : 'lax',
    maxAge: 1000 * 60 * 60 * 12
  }
};
