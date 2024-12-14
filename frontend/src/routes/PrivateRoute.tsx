import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

interface PrivateRouteProps {
  children: React.ReactNode;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
} 