import { useAuth } from '@/hooks/useAuth';
import type { UserRole } from '@/types/user';
import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuth();

  // If not logged in
  if (!isAuthenticated || !user) {
    return <Navigate to='/' replace />;
  }

  // Default redirect to Inventory
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to='/inventory' replace />;
  }

  return <>{children}</>;
}
