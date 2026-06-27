import { useMemo } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './common/Loader';

const RoleProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  const redirectTarget = useMemo(() => {
    if (!user) return '/login';
    if (!allowedRoles.includes(user.role)) {
      if (user.role === 'admin') return '/admin/dashboard';
      if (user.role === 'instructor') return '/dashboard';
      return '/instructors';
    }
    return null;
  }, [user, allowedRoles]);

  if (loading) return <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900"><Loader /></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (redirectTarget && location.pathname !== redirectTarget) {
    return <Navigate to={redirectTarget} replace />;
  }

  return children;
};

export default RoleProtectedRoute;
