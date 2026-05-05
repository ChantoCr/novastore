function AuthBootstrapFallback({
  title = 'Restoring your session',
  description = 'NOVA Store is validating your saved session before rendering protected account and admin content.',
}) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-8 text-white shadow-2xl shadow-slate-950/30">
      <p className="text-xs uppercase tracking-[0.35em] text-violet-300">Authentication</p>
      <h2 className="mt-3 text-2xl font-semibold text-white">{title}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">{description}</p>
      <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/10">
        <div className="h-full w-1/3 animate-pulse rounded-full bg-violet-400" />
      </div>
    </section>
  );
}

export default AuthBootstrapFallback;
