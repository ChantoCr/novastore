import { useMemo } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { useRegisterMutation } from '../features/auth/api/authApi.js';
import AuthBootstrapFallback from '../features/auth/components/AuthBootstrapFallback.jsx';
import RegisterForm from '../features/auth/components/RegisterForm.jsx';
import AuthSection from '../features/auth/components/AuthSection.jsx';
import { selectIsAuthBootstrapComplete } from '../features/auth/authSlice.js';

function RegisterPage() {
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const role = useSelector((state) => state.auth.role);
  const isAuthBootstrapComplete = useSelector(selectIsAuthBootstrapComplete);
  const [register, { isLoading, error }] = useRegisterMutation();

  const errorMessage = useMemo(() => {
    if (!error) {
      return null;
    }

    return error?.data?.message || 'Registration failed. Check backend setup and demo data.';
  }, [error]);

  if (!isAuthBootstrapComplete) {
    return (
      <AuthBootstrapFallback
        title="Checking for an existing session"
        description="NOVA Store is restoring any saved session before showing the registration form or redirecting authenticated users."
      />
    );
  }

  if (isAuthenticated) {
    return <Navigate to={role === 'admin' ? '/admin/products' : '/account'} replace />;
  }

  async function handleSubmit(values) {
    await register(values).unwrap();
    navigate('/account', { replace: true });
  }

  return (
    <AuthSection
      eyebrow="Authentication"
      title="Create your NOVA account"
      description="New registrations are provisioned with the shopper role and redirected into the authenticated account area after success."
    >
      <RegisterForm
        defaultValues={{
          name: 'Demo Shopper',
          email: 'shopper@novastore.dev',
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
