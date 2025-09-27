import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      <header className="flex items-center justify-between px-6 py-8">
        <div className="text-2xl font-semibold tracking-tight text-brand-light">Flux Trader</div>
        <nav className="flex gap-4 text-sm text-slate-300">
          <a href="#features" className="transition hover:text-white">
            Features
          </a>
          <a href="#compliance" className="transition hover:text-white">
            Compliance
          </a>
          <Link to="/app" className="rounded-full bg-brand px-4 py-2 font-semibold text-white shadow">
            Launch App
          </Link>
        </nav>
      </header>
      <main className="flex flex-1 flex-col items-center px-6 text-center">
        <section className="max-w-4xl py-16">
          <h1 className="text-4xl font-bold leading-tight md:text-6xl">
            Real-time Deriv trading with institutional-grade analytics.
          </h1>
          <p className="mt-6 text-lg text-slate-300">
            Flux Trader combines Deriv contracts with TradingView Advanced Charts to deliver a powerful yet intuitive experience
            for both new and professional traders.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/app"
              className="rounded-full bg-brand px-6 py-3 text-lg font-semibold text-white shadow transition hover:bg-brand-light"
            >
              Start Trading (Beta)
            </Link>
            <a
              href="mailto:partners@fluxtrader.com"
              className="rounded-full border border-slate-600 px-6 py-3 text-lg font-semibold text-slate-100 transition hover:border-brand-light hover:text-brand-light"
            >
              Contact Sales
            </a>
          </div>
        </section>
        <section id="features" className="grid w-full max-w-5xl gap-6 rounded-3xl bg-slate-900/60 p-8 md:grid-cols-3">
          {[
            {
              title: 'TradingView Advanced Charts',
              description: 'Connect your Deriv account to institutional-grade charting with fully customisable layouts.'
            },
            {
              title: 'Secure proxy & OAuth',
              description: 'Authorise trades via Deriv OAuth while keeping sensitive tokens secure in our backend.'
            },
            {
              title: 'Real-time analytics',
              description: 'Monitor balance, open positions and P&L with second-by-second updates and alerts.'
            }
          ].map((card) => (
            <article key={card.title} className="rounded-2xl bg-slate-900/80 p-6 text-left shadow-lg">
              <h3 className="text-xl font-semibold text-white">{card.title}</h3>
              <p className="mt-3 text-sm text-slate-300">{card.description}</p>
            </article>
          ))}
        </section>
        <section id="compliance" className="mt-16 max-w-3xl rounded-3xl border border-slate-700 bg-slate-950/60 p-8 text-sm text-slate-300">
          <h2 className="text-2xl font-semibold text-white">Compliance & Partner Statement</h2>
          <p className="mt-4">
            Flux Trader is an independent partner application. We do not use the Deriv name in our domain and clearly identify
            ourselves as a partner. Live trading is available only after Deriv authorisation. Always evaluate the suitability of
            high-risk trading before participating.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
