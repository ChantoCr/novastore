import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

import AuthBootstrapFallback from '../../features/auth/components/AuthBootstrapFallback.jsx';
import { selectIsAuthBootstrapComplete } from '../../features/auth/authSlice.js';

function ProtectedRoute({ children }) {
  const location = useLocation();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const isAuthBootstrapComplete = useSelector(selectIsAuthBootstrapComplete);

  if (!isAuthBootstrapComplete) {
    return <AuthBootstrapFallback />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}

export default ProtectedRoute;
