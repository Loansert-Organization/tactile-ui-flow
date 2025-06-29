import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

/*
 * Guard component that restricts /admin routes to users whose role === 'admin'.
 * Non-admin or unauthenticated users are redirected to home (or a 403 page later).
 */
export const AdminGuard: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { user, userRole, loading } = useAuth();
  const location = useLocation();

  if (loading) return null; // optionally a spinner

  if (!user || userRole !== 'admin') {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  return children;
}; 