const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const architectureAreas = [
  {
    title: 'Frontend',
    description: 'React, Router, Redux Toolkit, RTK Query, Tailwind, reusable layouts, and premium UI patterns.',
  },
  {
    title: 'Backend',
    description: 'Express layered architecture with controllers, services, repositories, validation, and secure middleware.',
  },
  {
    title: 'Database',
    description: 'MySQL relational schema with products, orders, coupons, notifications, audit logs, and stock tracking.',
  },
  {
    title: 'DevOps',
    description: 'Dockerized local setup, environment-based config, and documentation meant for portfolio review.',
  },
];

function HomePage() {
  return (
    <section className="space-y-10">
      <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-slate-950 to-violet-950 p-8 shadow-glow">
        <p className="mb-3 text-sm uppercase tracking-[0.35em] text-violet-300">Production-minded portfolio project</p>
        <h2 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
          Build an e-commerce platform that feels real, scalable, and review-ready.
        </h2>
        <p className="mt-4 max-w-2xl text-base text-slate-300 sm:text-lg">
          This starter view confirms the frontend scaffold is running. The next phases will implement auth, catalog,
          cart, orders, admin workflows, security, and testing.
        </p>

        <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-200">
          <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">React + Vite</span>
          <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">Redux Toolkit</span>
          <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">Express + MySQL</span>
          <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">Docker Ready</span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {architectureAreas.map((area) => (
          <article key={area.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h3 className="text-lg font-semibold text-white">{area.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">{area.description}</p>
          </article>
        ))}
      </div>

      <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-5">
        <p className="text-sm font-medium text-emerald-200">Starter API target</p>
        <code className="mt-2 block break-all text-sm text-emerald-100">{apiUrl}</code>
      </div>
    </section>
  );
}

export default HomePage;
