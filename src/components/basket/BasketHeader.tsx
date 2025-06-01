
import React from 'react';
import { Users, Settings, Target, Calendar } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { ShareButton } from '@/components/ui/share-button';
import { formatCurrency } from '@/lib/formatters';

interface BasketHeaderProps {
  basket: {
    id?: string;
    name: string;
    description: string;
    goal: number;
    totalContributions: number;
    participants: number;
    progress: number;
    daysLeft: number;
    isOwner: boolean;
  };
  onShare: () => void;
  onSettings: () => void;
}

export const BasketHeader = ({
  basket,
  onShare,
  onSettings
}: BasketHeaderProps) => {
  const basketURL = `${window.location.origin}/basket/${basket.id || 'abc123'}`;

  return <GlassCard className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex-1 min-w-0">
            <h1 className="font-bold gradient-text text-xl truncate">{basket.name}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{basket.participants}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{basket.daysLeft}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <ShareButton 
            basketName={basket.name} 
            basketURL={basketURL}
            size="md"
          />
          {basket.isOwner && <button onClick={onSettings} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
              <Settings className="w-5 h-5" />
            </button>}
        </div>
      </div>

      {/* Progress Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Progress</span>
          <span className="font-semibold gradient-text-blue">{basket.progress}%</span>
        </div>
        
        <div className="relative h-3 bg-gray-700 rounded-full overflow-hidden">
          <div className="absolute inset-y-0 left-0 bg-gradient-teal-blue rounded-full transition-all duration-700" style={{
          width: `${basket.progress}%`
        }}>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">{formatCurrency(basket.totalContributions)}</span>
          <div className="flex items-center gap-1 text-gray-400">
            <Target className="w-4 h-4" />
            <span>{formatCurrency(basket.goal)}</span>
          </div>
        </div>
      </div>
    </GlassCard>;
};
