import axios from 'axios';
import { prisma } from '../db/client';
import { getDerivAuthHeaders } from './derivClient';

interface BalanceResponse {
  balance: number;
  currency: string;
}

interface PortfolioPosition {
  contract_id: string;
  symbol: string;
  entry_price: number;
  current_spot: number;
  payout: number;
  contract_type: 'CALL' | 'PUT';
}

export async function getAccountSummary(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user?.accessToken) {
    throw new Error('User not authenticated with Deriv');
  }

  const headers = await getDerivAuthHeaders(user);

  const [{ data: balance }, { data: portfolio }] = await Promise.all([
    axios.get<BalanceResponse>('https://api.deriv.com/binary/v1/account/balance', { headers }),
    axios.get<{ positions: PortfolioPosition[] }>('https://api.deriv.com/binary/v1/portfolio', { headers })
  ]);

  return {
    balance: balance.balance,
    currency: balance.currency,
    pnl: portfolio.positions.reduce((acc, position) => acc + (position.payout - position.entry_price), 0),
    defaultSymbol: portfolio.positions[0]?.symbol ?? 'R_100',
    positions: portfolio.positions.map((position) => ({
      contract_id: position.contract_id,
      symbol: position.symbol,
      direction: position.contract_type === 'CALL' ? 'RISE' : 'FALL',
      stake: position.entry_price,
      payout: position.payout,
      spot_price: position.current_spot
    }))
  };
}
