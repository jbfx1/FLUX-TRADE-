import dotenv from 'dotenv';
import { env } from './config/env';
import { createDatafeed } from './services/datafeed';
import { createApp } from './app';

dotenv.config();
const app = createApp();

const server = app.listen(env.port, () => {
  console.log(`Flux Trader server listening on ${env.port}`);
});

createDatafeed().catch((error) => {
  console.error('Failed to initialise datafeed', error);
  process.exit(1);
});

process.on('SIGTERM', () => {
  server.close(() => process.exit(0));
});
