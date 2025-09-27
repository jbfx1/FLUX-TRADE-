export interface Position {
  contract_id: string;
  symbol: string;
  direction: 'RISE' | 'FALL';
  stake: number;
  payout: number;
  spot_price: number;
}

export interface AccountSummary {
  balance: number;
  currency: string;
  pnl: number;
  defaultSymbol: string;
  positions: Position[];
}

export interface OrderRequest {
  symbol: string;
  duration: number;
  stake: number;
  direction: 'RISE' | 'FALL';
}

export interface OrderResponse {
  contract_id: string;
  message: string;
}
