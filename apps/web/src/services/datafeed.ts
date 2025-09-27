import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'
});

export async function getHistory(symbol: string, timeframe: number, from: number, to: number) {
  const { data } = await api.get('/datafeed/history', {
    params: { symbol, timeframe, from, to },
    withCredentials: true
  });
  return data as { candles: Array<{ time: number; open: number; high: number; low: number; close: number; volume: number }> };
}
