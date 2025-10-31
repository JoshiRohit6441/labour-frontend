import { Navigate } from 'react-router-dom';
import { authApi } from '@/lib/api/auth';

interface ProtectedRouteProps {
  children: JSX.Element;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isAuthed = authApi.isAuthenticated();
  if (!isAuthed) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

interface RoleRouteProps {
  allowedRoles: Array<'USER' | 'CONTRACTOR'>;
  children: JSX.Element;
}

export const RoleRoute = ({ allowedRoles, children }: RoleRouteProps) => {
  const user = authApi.getCurrentUser();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (!allowedRoles.includes(user.role)) {
    const fallback = user.role === 'CONTRACTOR' ? '/contractor/dashboard' : '/user/dashboard';
    return <Navigate to={fallback} replace />;
  }
  return children;
};

export default ProtectedRoute;


