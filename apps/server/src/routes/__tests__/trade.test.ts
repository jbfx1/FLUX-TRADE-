import request from 'supertest';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { createApp } from '../../app';

const placeRiseFallContract = vi.fn(async () => ({ contract_id: '123', message: 'Order placed' }));
const closeContract = vi.fn(async () => ({ sold_for: 12 }));

vi.mock('../../services/orderService', () => ({
  placeRiseFallContract,
  closeContract
}));

vi.mock('../../services/session', () => ({
  requireAuth: (req: any, _res: any, next: any) => {
    req.userId = 'user';
    next();
  }
}));

describe('trade routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('places orders when authenticated', async () => {
    const app = createApp();
    const response = await request(app)
      .post('/trade/buy')
      .send({ direction: 'RISE', stake: 10, duration: 5, symbol: 'R_100' });

    expect(response.status).toBe(200);
    expect(placeRiseFallContract).toHaveBeenCalledWith('user', {
      direction: 'RISE',
      stake: 10,
      duration: 5,
      symbol: 'R_100'
    });
  });

  it('closes contracts', async () => {
    const app = createApp();
    const response = await request(app).post('/trade/sell').send({ contract_id: '123' });
    expect(response.status).toBe(200);
    expect(closeContract).toHaveBeenCalledWith('user', '123');
  });
});
