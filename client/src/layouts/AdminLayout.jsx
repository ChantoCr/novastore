import { NavLink, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

function AdminLayout() {
  const user = useSelector((state) => state.auth.user);

  return (
    <div className="min-h-screen bg-background text-white">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[260px_1fr]">
        <aside className="rounded-3xl border border-white/10 bg-slate-950/70 p-6">
          <p className="text-xs uppercase tracking-[0.35em] text-violet-300">Admin</p>
          <h1 className="mt-3 text-2xl font-semibold text-white">NOVA Control Center</h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Signed in as {user?.name || 'Admin'} · {user?.roles?.join(', ') || 'admin'}
          </p>

          <nav className="mt-8 space-y-2">
            <NavLink
              to="/admin/products"
              className={({ isActive }) =>
                `block rounded-2xl px-4 py-3 text-sm transition ${
                  isActive
                    ? 'bg-violet-500 text-white'
                    : 'border border-white/10 bg-white/5 text-slate-200 hover:border-violet-400/30 hover:text-white'
                }`
              }
            >
              Product management
            </NavLink>
            <NavLink
              to="/products"
              className={({ isActive }) =>
                `block rounded-2xl px-4 py-3 text-sm transition ${
                  isActive
                    ? 'bg-violet-500 text-white'
                    : 'border border-white/10 bg-white/5 text-slate-200 hover:border-violet-400/30 hover:text-white'
                }`
              }
            >
              Public catalog
            </NavLink>
          </nav>
        </aside>

        <main className="space-y-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
