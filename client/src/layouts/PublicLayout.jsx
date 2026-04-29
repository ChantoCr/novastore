import { Outlet } from 'react-router-dom';

function PublicLayout() {
  return (
    <div className="min-h-screen bg-background text-white">
      <header className="border-b border-white/10 bg-black/20 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-violet-300">NOVA Store</p>
            <h1 className="text-lg font-semibold">Portfolio E-commerce Architecture</h1>
          </div>
          <span className="rounded-full border border-violet-400/30 bg-violet-500/10 px-3 py-1 text-xs text-violet-200">
            Scaffold Ready
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <Outlet />
      </main>
    </div>
  );
}

export default PublicLayout;
