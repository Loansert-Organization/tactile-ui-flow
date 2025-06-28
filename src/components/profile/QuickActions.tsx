
import React from 'react';
import { History, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '@/components/ui/glass-card';

export const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  return (
    <GlassCard variant="default" hover interactive className="responsive-padding">
      <button 
        className="w-full flex items-center justify-between touch-target p-2 -m-2 rounded-xl hover:bg-white/10 transition-all duration-200 active:scale-95"
        onClick={() => navigate('/history')}
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <History className="w-6 h-6 text-white" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-white text-base">Transaction History</p>
            <p className="text-sm text-gray-300">View all your transactions</p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-gray-400" />
      </button>
    </GlassCard>
  );
};
