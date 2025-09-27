import express from 'express';
import session from 'express-session';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import { env } from './config/env';
import { sessionConfig } from './config/session';
import authRouter from './routes/auth';
import tradeRouter from './routes/trade';
import accountRouter from './routes/account';
import datafeedRouter from './routes/datafeed';

export function createApp() {
  const app = express();

  app.use(
    helmet({
      contentSecurityPolicy: env.isProduction ? undefined : false,
      crossOriginEmbedderPolicy: false
    })
  );
  app.use(morgan(env.logFormat));
  app.use(
    cors({
      origin: env.webOrigin,
      credentials: true
    })
  );
  app.use(express.json({ limit: '1mb' }));
  app.use(session(sessionConfig));

  app.get('/health', (_req, res) => res.json({ status: 'ok' }));
  app.use('/auth', authRouter);
  app.use('/trade', tradeRouter);
  app.use('/account', accountRouter);
  app.use('/datafeed', datafeedRouter);

  return app;
}
