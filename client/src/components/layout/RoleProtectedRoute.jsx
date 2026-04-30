import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

function RoleProtectedRoute({ allowedRoles = [], children }) {
  const location = useLocation();
  const role = useSelector((state) => state.auth.role);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/account" replace />;
  }

  return children;
}

export default RoleProtectedRoute;
