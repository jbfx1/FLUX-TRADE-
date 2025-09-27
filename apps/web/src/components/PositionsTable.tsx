import type { Position } from '../types/account';

interface PositionsTableProps {
  positions: Position[];
  currency: string;
  isLoading: boolean;
}

export default function PositionsTable({ positions, currency, isLoading }: PositionsTableProps) {
  if (isLoading) {
    return <div className="h-48 animate-pulse rounded-2xl bg-slate-800" />;
  }

  if (!positions.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 p-8 text-center text-sm text-slate-400">
        No open positions. Place your first trade using the order ticket.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800">
      <table className="min-w-full divide-y divide-slate-800 text-sm text-slate-200">
        <thead className="bg-slate-900/80 text-xs uppercase text-slate-400">
          <tr>
            <th className="px-4 py-3 text-left">Contract</th>
            <th className="px-4 py-3 text-left">Direction</th>
            <th className="px-4 py-3 text-right">Stake</th>
            <th className="px-4 py-3 text-right">Payout</th>
            <th className="px-4 py-3 text-right">Spot</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {positions.map((position) => (
            <tr key={position.contract_id}>
              <td className="px-4 py-3">{position.symbol}</td>
              <td className="px-4 py-3">{position.direction}</td>
              <td className="px-4 py-3 text-right">
                {position.stake.toFixed(2)} {currency}
              </td>
              <td className="px-4 py-3 text-right">
                {position.payout.toFixed(2)} {currency}
              </td>
              <td className="px-4 py-3 text-right">{position.spot_price.toFixed(4)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
