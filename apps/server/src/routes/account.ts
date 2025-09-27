import { Router } from 'express';
import { requireAuth } from '../services/session';
import { getAccountSummary } from '../services/accountService';

const router = Router();

router.get('/summary', requireAuth, async (req, res) => {
  try {
    const summary = await getAccountSummary(req.userId!);
    res.json(summary);
  } catch (error: any) {
    res.status(500).json({ message: error?.message ?? 'Failed to fetch account summary' });
  }
});

export default router;
