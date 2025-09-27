import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';
import { createApp } from '../../app';

const getAccountSummary = vi.fn(async () => ({
  balance: 1000,
  currency: 'USD',
  pnl: 12,
  defaultSymbol: 'R_100',
  positions: []
}));

vi.mock('../../services/accountService', () => ({
  getAccountSummary
}));

vi.mock('../../services/session', () => ({
  requireAuth: (req: any, _res: any, next: any) => {
    req.userId = 'user';
    next();
  }
}));

describe('account routes', () => {
  it('returns account summary', async () => {
    const app = createApp();
    const response = await request(app).get('/account/summary');
    expect(response.status).toBe(200);
    expect(response.body.balance).toBe(1000);
    expect(getAccountSummary).toHaveBeenCalledWith('user');
  });
});
