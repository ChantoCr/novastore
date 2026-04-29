import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

import { useRegisterMutation } from '../features/auth/api/authApi.js';
import AuthSection from '../features/auth/components/AuthSection.jsx';

function RegisterPage() {
  const [formState, setFormState] = useState({
    name: 'Demo Shopper',
    email: 'shopper@novastore.dev',
    password: 'NovaStore123!',
  });
  const [register, { isLoading, isSuccess, error }] = useRegisterMutation();

  const errorMessage = useMemo(() => {
    if (!error) {
      return null;
    }

    return error?.data?.message || 'Registration failed. Check backend setup and demo data.';
  }, [error]);

  async function handleSubmit(event) {
    event.preventDefault();
    await register(formState);
  }

  return (
    <AuthSection
      eyebrow="Authentication"
      title="Create your NOVA account"
      description="This scaffold uses the backend register endpoint. In production-ready phases, validation UX and refresh-token strategy will be hardened further."
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block text-sm text-slate-200">
          Name
          <input
            type="text"
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none ring-0"
            value={formState.name}
            onChange={(event) => setFormState((current) => ({ ...current, name: event.target.value }))}
          />
        </label>

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
          {isLoading ? 'Creating account...' : 'Create account'}
        </button>
      </form>

      {errorMessage ? (
        <p className="mt-4 rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {errorMessage}
        </p>
      ) : null}

      {isSuccess ? (
        <p className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          Registration request succeeded.
        </p>
      ) : null}

      <p className="mt-6 text-sm text-slate-300">
        Already registered?{' '}
        <Link className="text-violet-300 hover:text-violet-200" to="/login">
          Sign in here
        </Link>
      </p>
    </AuthSection>
  );
}

export default RegisterPage;
