import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';

export default function AuthView({ mode }) {
  const registering = mode === 'register';
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async event => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (registering) await signUp(email, password);
      else await signIn(email, password);
      navigate(location.state?.from?.pathname || '/overview', { replace: true });
    } catch (requestError) {
      setError(requestError.message || 'Could not sign in. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#030014] text-white flex items-center justify-center px-5 py-10">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#09061a]/95 p-7 shadow-2xl md:p-9">
        <Link to="/" className="font-mono text-[10px] tracking-[0.32em] text-cyan-300">HELIX · STORY MAPS</Link>
        <h1 className="mt-7 text-2xl font-bold">{registering ? 'Create your account' : 'Welcome back'}</h1>
        <p className="mt-2 text-sm leading-6 text-slate-400">
          {registering ? 'Your film library is private to your account.' : 'Sign in to open your saved film library.'}
        </p>

        <form className="mt-7 space-y-4" onSubmit={submit}>
          <label className="block text-xs text-slate-300">
            Email
            <input
              type="email"
              autoComplete="email"
              required
              maxLength={254}
              value={email}
              onChange={event => setEmail(event.target.value)}
              className="mt-2 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-3 text-sm text-white outline-none focus:border-cyan-400/60"
            />
            {registering && <span className="mt-1 block text-[11px] text-slate-500">Use Gmail, Yahoo, Outlook, Hotmail, Rediffmail, iCloud, or Proton.</span>}
          </label>
          <label className="block text-xs text-slate-300">
            Password
            <input
              type="password"
              autoComplete={registering ? 'new-password' : 'current-password'}
              required
              minLength={registering ? 10 : 1}
              maxLength={128}
              value={password}
              onChange={event => setPassword(event.target.value)}
              className="mt-2 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-3 text-sm text-white outline-none focus:border-cyan-400/60"
            />
            {registering && <span className="mt-1 block text-[11px] text-slate-500">Use at least 10 characters.</span>}
          </label>
          {error && <p role="alert" className="rounded-lg border border-rose-400/20 bg-rose-500/10 p-3 text-sm text-rose-200">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-cyan-300 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-wait disabled:opacity-60"
          >
            {submitting ? 'Please wait…' : registering ? 'Create account' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-400">
          {registering ? 'Already have an account?' : 'New to Helix?'}{' '}
          <Link to={registering ? '/login' : '/register'} className="text-cyan-300 hover:text-cyan-200">
            {registering ? 'Sign in' : 'Create an account'}
          </Link>
        </p>
      </div>
    </main>
  );
}
