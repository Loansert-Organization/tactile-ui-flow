
import React from 'react';

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
  // Since all users now have anonymous auth, no gating is needed
  // Just render the children directly
  return <>{children}</>;
};
