import React from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';

export const SecuritySection: React.FC = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const isAnonymous = user?.app_metadata?.provider === 'anonymous';
  const methodLabel = isAnonymous ? 'Anonymous' : (user?.app_metadata?.provider || 'Unknown');

  return (
    <GlassCard className="p-4 space-y-3">
      <h3 className="text-lg font-semibold">Security</h3>
      <div className="flex items-center justify-between">
        <span className="text-gray-400">Authentication Method</span>
        <span>{methodLabel}</span>
      </div>
      {isAnonymous && (
        <Button className="w-full" onClick={()=>navigate('/login-options')}>Upgrade Account</Button>
      )}
    </GlassCard>
  );
}; 