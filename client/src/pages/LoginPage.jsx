import { useMemo } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { useLoginMutation } from '../features/auth/api/authApi.js';
import LoginForm from '../features/auth/components/LoginForm.jsx';
import AuthSection from '../features/auth/components/AuthSection.jsx';

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const role = useSelector((state) => state.auth.role);
  const [login, { isLoading, error }] = useLoginMutation();

  const errorMessage = useMemo(() => {
    if (!error) {
      return null;
    }

    return error?.data?.message || 'Login failed. Check your credentials and API setup.';
  }, [error]);

  if (isAuthenticated) {
    return <Navigate to={role === 'admin' ? '/admin/products' : '/account'} replace />;
  }

  async function handleSubmit(values) {
    const response = await login(values).unwrap();
    const fallbackPath = response.data.user.roles?.includes('admin') ? '/admin/products' : '/account';
    const nextPath = location.state?.from?.pathname || fallbackPath;

    navigate(nextPath, { replace: true });
  }

  return (
    <AuthSection
      eyebrow="Authentication"
      title="Sign in to NOVA Store"
      description="Use the seeded demo accounts to verify role-aware access. Admins are redirected to product management, while shoppers land on their account page."
    >
      <LoginForm
        defaultValues={{
          email: 'admin@novastore.dev',
          password: 'NovaStore123!',
        }}
        isSubmitting={isLoading}
        onSubmit={handleSubmit}
      />

      {errorMessage ? (
        <p className="mt-4 rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {errorMessage}
        </p>
      ) : null}

      <div className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
        <p className="font-medium">Demo credentials</p>
        <p className="mt-1">Admin: admin@novastore.dev · NovaStore123!</p>
        <p className="mt-1">User: user@novastore.dev · NovaStore123!</p>
      </div>

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
