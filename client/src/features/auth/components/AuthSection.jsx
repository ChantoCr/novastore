function AuthSection({ eyebrow, title, description, children }) {
  return (
    <section className="mx-auto max-w-md rounded-3xl border border-white/10 bg-white/5 p-8 shadow-glow">
      <p className="text-xs uppercase tracking-[0.35em] text-violet-300">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-semibold text-white">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-slate-300">{description}</p>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export default AuthSection;
