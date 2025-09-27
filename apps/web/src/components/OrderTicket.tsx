import { FormEvent, useState } from 'react';
import { placeOrder } from '../services/api';

type Direction = 'RISE' | 'FALL';

interface OrderTicketProps {
  symbol: string;
  currency: string;
}

export default function OrderTicket({ symbol, currency }: OrderTicketProps) {
  const [direction, setDirection] = useState<Direction>('RISE');
  const [stake, setStake] = useState(10);
  const [duration, setDuration] = useState(5);
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setStatus('pending');
    setMessage('');
    try {
      const response = await placeOrder({ direction, stake, duration, symbol });
      setStatus('success');
      setMessage(`Order confirmed: ${response.contract_id}`);
    } catch (error: any) {
      setStatus('error');
      setMessage(error?.response?.data?.message ?? 'Unable to place order.');
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <header>
        <h2 className="text-xl font-semibold text-white">Order Ticket</h2>
        <p className="text-xs text-slate-400">Single Rise/Fall contract placement.</p>
      </header>
      <div className="space-y-2">
        <label className="text-xs uppercase text-slate-400">Symbol</label>
        <input
          value={symbol}
          readOnly
          className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-white"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
            direction === 'RISE' ? 'bg-emerald-500 text-slate-900' : 'border border-slate-700 bg-slate-900/60 text-slate-300'
          }`}
          onClick={() => setDirection('RISE')}
        >
          Rise
        </button>
        <button
          type="button"
          className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
            direction === 'FALL' ? 'bg-red-400 text-slate-900' : 'border border-slate-700 bg-slate-900/60 text-slate-300'
          }`}
          onClick={() => setDirection('FALL')}
        >
          Fall
        </button>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-xs uppercase text-slate-400">Stake ({currency})</label>
          <input
            type="number"
            min={1}
            step={1}
            value={stake}
            onChange={(event) => setStake(Number(event.target.value))}
            className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-white"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs uppercase text-slate-400">Duration (minutes)</label>
          <input
            type="number"
            min={1}
            step={1}
            value={duration}
            onChange={(event) => setDuration(Number(event.target.value))}
            className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-white"
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={status === 'pending'}
        className="w-full rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-light disabled:cursor-not-allowed disabled:bg-slate-700"
      >
        {status === 'pending' ? 'Placing order…' : 'Submit Order'}
      </button>
      {message && (
        <div
          role="status"
          className={`rounded-xl px-4 py-3 text-xs ${
            status === 'success' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-300'
          }`}
        >
          {message}
        </div>
      )}
    </form>
  );
}
