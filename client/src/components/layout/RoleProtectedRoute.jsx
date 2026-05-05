import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

import AuthBootstrapFallback from '../../features/auth/components/AuthBootstrapFallback.jsx';
import { selectIsAuthBootstrapComplete } from '../../features/auth/authSlice.js';

function RoleProtectedRoute({ allowedRoles = [], children }) {
  const location = useLocation();
  const role = useSelector((state) => state.auth.role);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isAuthBootstrapComplete = useSelector(selectIsAuthBootstrapComplete);

  if (!isAuthBootstrapComplete) {
    return (
      <AuthBootstrapFallback
        title="Restoring admin access"
        description="NOVA Store is validating the saved session before loading role-protected admin routes."
      />
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/account" replace />;
  }

  return children;
}

export default RoleProtectedRoute;
