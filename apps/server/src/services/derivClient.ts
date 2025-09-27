import WebSocket from 'ws';
import axios from 'axios';
import type { User } from '@prisma/client';
import { prisma } from '../db/client';
import { env } from '../config/env';

const websocketUrl = 'wss://stream.deriv.com/websockets/v3?app_id=';

export interface TickMessage {
  tick: {
    symbol: string;
    quote: number;
    epoch: number;
  };
}

export interface HistoryResponse {
  history: {
    prices: number[];
    times: number[];
  };
}

export async function getDerivAuthHeaders(user: User) {
  if (!user.accessToken) {
    throw new Error('Missing Deriv access token');
  }

  return {
    Authorization: `Bearer ${user.accessToken}`
  };
}

export async function refreshAccessToken(user: User) {
  if (!user.refreshToken) {
    throw new Error('Missing refresh token');
  }

  const response = await axios.post('https://oauth.deriv.com/token', null, {
    params: {
      grant_type: 'refresh_token',
      refresh_token: user.refreshToken,
      client_id: env.derivAppId
    }
  });

  const { access_token } = response.data;
  await prisma.user.update({ where: { id: user.id }, data: { accessToken: access_token } });
  return access_token;
}

export function createDerivWebSocket(symbol: string) {
  const ws = new WebSocket(`${websocketUrl}${env.derivAppId}`);

  ws.on('open', () => {
    ws.send(JSON.stringify({ ticks: symbol, subscribe: 1 }));
  });

  return ws;
}

export async function fetchHistoricalTicks(symbol: string, start: number, end: number) {
  const response = await axios.get<HistoryResponse>('https://api.deriv.com/binary/v1/ticks_history', {
    params: {
      ticks_history: symbol,
      start,
      end,
      style: 'candles'
    }
  });
  return response.data;
}
