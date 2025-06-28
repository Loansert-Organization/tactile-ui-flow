
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UpgradePromptModal } from './UpgradePromptModal';

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
  const { isLoggedIn } = useAuth();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  if (isLoggedIn) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <>
      <div onClick={() => setShowUpgradeModal(true)}>
        {children}
      </div>
      <UpgradePromptModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        feature={feature}
      />
    </>
  );
};
