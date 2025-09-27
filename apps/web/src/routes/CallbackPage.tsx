import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { exchangeAuthCode } from '../services/api';

export default function CallbackPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const code = params.get('code');
    if (!code) {
      navigate('/');
      return;
    }

    exchangeAuthCode(code)
      .then(() => navigate('/app'))
      .catch(() => navigate('/?error=auth'));
  }, [params, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
      <div className="rounded-3xl border border-slate-800 bg-slate-900/80 px-10 py-12 text-center shadow-xl">
        <h1 className="text-2xl font-semibold">Signing you in…</h1>
        <p className="mt-4 text-sm text-slate-400">Please wait while we finalise the secure connection to Deriv.</p>
      </div>
    </div>
  );
}
