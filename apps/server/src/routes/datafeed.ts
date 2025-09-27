import { Router } from 'express';
import { datafeed } from '../services/datafeed';

const router = Router();

router.get('/history', (req, res) => {
  const symbol = (req.query.symbol as string) ?? 'R_100';
  const timeframe = Number(req.query.timeframe ?? 60);
  const from = Number(req.query.from ?? 0);
  const to = Number(req.query.to ?? Math.floor(Date.now() / 1000));

  if (!timeframe) {
    return res.status(400).json({ message: 'Invalid timeframe' });
  }

  const candles = datafeed.getHistory(symbol, timeframe, from, to);
  res.json({ candles });
});

export default router;
