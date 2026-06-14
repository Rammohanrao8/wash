import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore, Role } from '@/store/useAuthStore';

interface ProtectedRouteProps {
  allowedRoles?: Role[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, user, checkAuth, isLoading } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to their respective dashboard if they try to access unauthorized routes
    if (user.role === 'CUSTOMER') return <Navigate to="/shops" replace />;
    if (user.role === 'SHOP_OWNER') return <Navigate to="/dashboard/shop" replace />;
    if (user.role === 'DELIVERY_PARTNER') return <Navigate to="/dashboard/delivery" replace />;
    if (user.role === 'ADMIN') return <Navigate to="/dashboard/admin" replace />;
  }

  return <Outlet />;
};
