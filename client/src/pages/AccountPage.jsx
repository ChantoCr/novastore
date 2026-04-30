import { useSelector } from 'react-redux';

function AccountPage() {
  const user = useSelector((state) => state.auth.user);
  const role = useSelector((state) => state.auth.role);

  return (
    <section className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
        <p className="text-xs uppercase tracking-[0.35em] text-violet-300">Account</p>
        <h2 className="mt-3 text-3xl font-semibold text-white">Authenticated session</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
          This page confirms the current authenticated user and role resolved from the backend auth
          flow.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-3xl border border-white/10 bg-slate-950/60 p-5">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Name</p>
          <p className="mt-3 text-lg font-semibold text-white">{user?.name || 'Unknown user'}</p>
        </article>

        <article className="rounded-3xl border border-white/10 bg-slate-950/60 p-5">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Email</p>
          <p className="mt-3 text-lg font-semibold text-white">{user?.email || 'Unavailable'}</p>
        </article>

        <article className="rounded-3xl border border-white/10 bg-slate-950/60 p-5">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Primary role</p>
          <p className="mt-3 text-lg font-semibold capitalize text-white">{role || 'guest'}</p>
        </article>

        <article className="rounded-3xl border border-white/10 bg-slate-950/60 p-5">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Access level</p>
          <p className="mt-3 text-lg font-semibold text-white">
            {role === 'admin' ? 'Admin dashboard enabled' : 'Shopper account'}
          </p>
        </article>
      </div>
    </section>
  );
}

export default AccountPage;
