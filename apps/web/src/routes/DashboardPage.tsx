import { Suspense, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccountSummary } from '../hooks/useAccountSummary';
import Footer from '../components/Footer';
import TradingChart from '../components/TradingChart';
import OrderTicket from '../components/OrderTicket';
import PositionsTable from '../components/PositionsTable';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { data: account, isLoading, error } = useAccountSummary();

  const summary = useMemo(
    () => ({
      balance: account?.balance ?? 0,
      currency: account?.currency ?? 'USD',
      pnl: account?.pnl ?? 0,
      openPositions: account?.positions ?? []
    }),
    [account]
  );

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      <header className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
        <div>
          <div className="text-lg font-semibold text-brand-light">Flux Trader</div>
          <p className="text-xs text-slate-400">Powered by Deriv · TradingView integration ready</p>
        </div>
        <button
          onClick={() => navigate('/')}
          className="rounded-full border border-slate-600 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-brand-light hover:text-brand-light"
        >
          Back to Landing
        </button>
      </header>
      <main className="grid flex-1 gap-4 px-6 py-6 lg:grid-cols-[2fr_1fr]">
        <section className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 rounded-3xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg">
            <Suspense fallback={<div className="h-[480px] animate-pulse rounded-2xl bg-slate-800" />}
            >
              <TradingChart symbol={account?.defaultSymbol ?? 'R_100'} />
            </Suspense>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-900/70 p-4 shadow-lg">
            <PositionsTable positions={summary.openPositions} currency={summary.currency} isLoading={isLoading} />
          </div>
        </section>
        <aside className="flex flex-col gap-4">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-white">Account Summary</h2>
            {error ? (
              <p className="mt-4 text-sm text-red-400">Unable to load account summary. Please try again.</p>
            ) : (
              <div className="mt-4 space-y-3 text-sm text-slate-300">
                <p>
                  Balance: <span className="text-white">{summary.balance.toFixed(2)}</span> {summary.currency}
                </p>
                <p>
                  Realised P&L: <span className={summary.pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                    {summary.pnl.toFixed(2)}
                  </span>{' '}
                  {summary.currency}
                </p>
                <p>Open Positions: {summary.openPositions.length}</p>
              </div>
            )}
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-lg">
            <OrderTicket symbol={account?.defaultSymbol ?? 'R_100'} currency={summary.currency} />
          </div>
        </aside>
      </main>
      <Footer />
    </div>
  );
}
