
import React from 'react';
import { History, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '@/components/ui/glass-card';
import { EnhancedButton } from '@/components/ui/enhanced-button';

export const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  return (
    <GlassCard variant="default" size="md">
      <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
      <div className="space-y-3">
        <EnhancedButton 
          variant="glass" 
          className="w-full justify-between h-auto p-4 text-left"
          onClick={() => navigate('/history')}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
              <History className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium text-white text-sm">Transaction History</p>
              <p className="text-xs text-white/70 mt-1">View all your transactions</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-white/60 flex-shrink-0" />
        </EnhancedButton>
      </div>
    </GlassCard>
  );
};
