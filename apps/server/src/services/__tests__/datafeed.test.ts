import { describe, expect, it, vi, beforeEach } from 'vitest';
import * as derivClient from '../derivClient';
import { datafeed } from '../datafeed';

vi.mock('../derivClient', () => ({
  createDerivWebSocket: vi.fn(() => ({
    on: vi.fn()
  })),
  fetchHistoricalTicks: vi.fn(async () => ({
    history: {
      times: [0, 30, 60, 90],
      prices: [100, 101, 102, 103]
    }
  }))
}));

describe('datafeed', () => {
  beforeEach(() => {
    datafeed.seed('R_100', [0, 30, 60, 90], [100, 101, 102, 103]);
  });

  it('aggregates history into candles', () => {
    const candles = datafeed.getHistory('R_100', 60, 0, 120);
    expect(candles).toHaveLength(2);
    expect(candles[0].open).toBe(100);
    expect(candles[1].close).toBe(103);
  });
});
