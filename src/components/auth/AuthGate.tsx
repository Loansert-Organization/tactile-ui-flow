
import React from 'react';
import { useAuthContext } from '@/contexts/AuthContext';

interface AuthGateProps {
  children: React.ReactNode;
  feature: string;
  fallback?: React.ReactNode;
}

export const AuthGate: React.FC<AuthGateProps> = ({ 
  children, 
  feature, 
  fallback 
}) => {
  const { user, loading } = useAuthContext();
  
  // Show loading state while auth is initializing
  if (loading) {
    return <div className="flex justify-center items-center py-8">
      <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
    </div>;
  }
  
  // Allow access for all users (anonymous auth is always available)
  return <>{children}</>;
};
