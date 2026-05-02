import { useDispatch, useSelector } from 'react-redux';
import { NavLink, Outlet } from 'react-router-dom';

import { clearCredentials } from '../features/auth/authSlice.js';
import { useLogoutMutation } from '../features/auth/api/authApi.js';
import { selectCartItemCount } from '../features/cart/cartSlice.js';

function PublicLayout() {
  const dispatch = useDispatch();
  const { isAuthenticated, refreshToken, role, user } = useSelector((state) => state.auth);
  const cartItemCount = useSelector(selectCartItemCount);
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

  const navItems = [
    { label: 'Home', to: '/' },
    { label: 'Products', to: '/products' },
    { label: `Cart${cartItemCount ? ` (${cartItemCount})` : ''}`, to: '/cart' },
    ...(isAuthenticated ? [{ label: 'Account', to: '/account' }] : []),
    ...(role === 'admin' ? [{ label: 'Admin', to: '/admin/products' }] : []),
    ...(!isAuthenticated
      ? [
          { label: 'Login', to: '/login' },
          { label: 'Register', to: '/register' },
        ]
      : []),
  ];

  async function handleLogout() {
    if (!refreshToken) {
      dispatch(clearCredentials());
      return;
    }

    try {
      await logout({ refreshToken }).unwrap();
    } catch {
      dispatch(clearCredentials());
    }
  }

  return (
    <div className="min-h-screen bg-background text-white">
      <header className="border-b border-white/10 bg-black/20 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-violet-300">NOVA Store</p>
            <h1 className="text-lg font-semibold">Portfolio E-commerce Architecture</h1>
          </div>

          <div className="flex flex-col gap-3 lg:items-end">
            {isAuthenticated ? (
              <div className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-4 py-2 text-xs uppercase tracking-[0.25em] text-emerald-100">
                Signed in as {user?.name || 'User'} · {role || 'user'}
              </div>
            ) : null}

            <div className="flex flex-wrap items-center gap-2">
              <nav className="flex flex-wrap gap-2">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `rounded-full px-4 py-2 text-sm transition ${
                        isActive
                          ? 'bg-violet-500 text-white'
                          : 'border border-white/10 bg-white/5 text-slate-200 hover:border-violet-400/30 hover:text-white'
                      }`
                    }
                    end={item.to === '/'}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </nav>

              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:border-violet-400/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoggingOut ? 'Signing out...' : 'Logout'}
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">
        <Outlet />
      </main>
    </div>
  );
}

export default PublicLayout;
