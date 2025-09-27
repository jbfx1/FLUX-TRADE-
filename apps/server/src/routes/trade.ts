import { Router } from 'express';
import { requireAuth } from '../services/session';
import { placeRiseFallContract, closeContract } from '../services/orderService';

const router = Router();

router.post('/buy', requireAuth, async (req, res) => {
  const { direction, stake, duration, symbol } = req.body as {
    direction: 'RISE' | 'FALL';
    stake: number;
    duration: number;
    symbol: string;
  };

  if (!direction || !stake || !duration || !symbol) {
    return res.status(400).json({ message: 'Missing order parameters' });
  }

  try {
    const result = await placeRiseFallContract(req.userId!, { direction, stake, duration, symbol });
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ message: error?.message ?? 'Unable to place order' });
  }
});

router.post('/sell', requireAuth, async (req, res) => {
  const { contract_id } = req.body as { contract_id: string };
  if (!contract_id) {
    return res.status(400).json({ message: 'Missing contract_id' });
  }

  try {
    const result = await closeContract(req.userId!, contract_id);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ message: error?.message ?? 'Unable to close contract' });
  }
});

export default router;
