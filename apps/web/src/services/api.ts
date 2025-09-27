import axios from 'axios';
import type { AccountSummary, OrderRequest, OrderResponse } from '../types/account';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080'
});

export async function getAccountSummary(): Promise<AccountSummary> {
  const { data } = await api.get<AccountSummary>('/account/summary', { withCredentials: true });
  return data;
}

export async function placeOrder(payload: OrderRequest): Promise<OrderResponse> {
  const { data } = await api.post<OrderResponse>('/trade/buy', payload, { withCredentials: true });
  return data;
}

export async function exchangeAuthCode(code: string): Promise<void> {
  await api.post(
    '/auth/exchange',
    { code, redirect_uri: import.meta.env.VITE_PUBLIC_URL + '/callback' },
    { withCredentials: true }
  );
}
