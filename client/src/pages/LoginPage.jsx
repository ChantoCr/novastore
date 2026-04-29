import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import AuthSection from '../features/auth/components/AuthSection.jsx';
import { useLoginMutation } from '../features/auth/api/authApi.js';

function LoginPage() {
  const [formState, setFormState] = useState({
    email: 'admin@novastore.dev',
    password: 'NovaStore123!',
  });
  const [login, { isLoading, isSuccess, error }] = useLoginMutation();

  const errorMessage = useMemo(() => {
    if (!error) {
      return null;
    }

    return error?.data?.message || 'Login failed. Check your credentials and API setup.';
  }, [error]);

  async function handleSubmit(event) {
    event.preventDefault();
    await login(formState);
  }

  return (
    <AuthSection
      eyebrow="Authentication"
      title="Sign in to NOVA Store"
      description="This page is connected to the auth module scaffold. Real login works once the seed password hashes are replaced with valid bcrypt hashes."
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block text-sm text-slate-200">
          Email
          <input
            type="email"
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none ring-0"
            value={formState.email}
            onChange={(event) => setFormState((current) => ({ ...current, email: event.target.value }))}
          />
        </label>

        <label className="block text-sm text-slate-200">
          Password
          <input
            type="password"
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none ring-0"
            value={formState.password}
            onChange={(event) =>
              setFormState((current) => ({ ...current, password: event.target.value }))
            }
          />
        </label>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-2xl bg-violet-500 px-4 py-3 font-medium text-white transition hover:bg-violet-400 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      {errorMessage ? (
        <p className="mt-4 rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {errorMessage}
        </p>
      ) : null}

      {isSuccess ? (
        <p className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          Login request succeeded. You can now access protected flows once they are added.
        </p>
      ) : null}

      <p className="mt-6 text-sm text-slate-300">
        Need an account?{' '}
        <Link className="text-violet-300 hover:text-violet-200" to="/register">
          Create one here
        </Link>
      </p>
    </AuthSection>
  );
}

export default LoginPage;
