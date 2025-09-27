import axios from 'axios';
import { prisma } from '../db/client';
import { getDerivAuthHeaders } from './derivClient';

interface RiseFallPayload {
  direction: 'RISE' | 'FALL';
  stake: number;
  duration: number;
  symbol: string;
}

export async function placeRiseFallContract(userId: string, payload: RiseFallPayload) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new Error('User not found');
  }

  const headers = await getDerivAuthHeaders(user);

  const response = await axios.post('https://api.deriv.com/binary/v1/buy', {
    buy: 1,
    price: payload.stake,
    parameters: {
      amount: payload.stake,
      basis: 'stake',
      contract_type: payload.direction === 'RISE' ? 'CALL' : 'PUT',
      currency: 'USD',
      duration: payload.duration,
      duration_unit: 'm',
      symbol: payload.symbol
    }
  }, { headers });

  const { contract_id } = response.data;

  await prisma.position.create({
    data: {
      contractId: contract_id,
      symbol: payload.symbol,
      direction: payload.direction,
      stake: payload.stake,
      payout: payload.stake * 2,
      spotPrice: 0,
      userId
    }
  });

  return { contract_id, message: 'Order placed' };
}

export async function closeContract(userId: string, contractId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new Error('User not found');
  }
  const headers = await getDerivAuthHeaders(user);

  const response = await axios.post('https://api.deriv.com/binary/v1/sell', { sell: contractId }, { headers });

  await prisma.position.updateMany({
    where: { contractId },
    data: { closedAt: new Date() }
  });

  return response.data;
}
