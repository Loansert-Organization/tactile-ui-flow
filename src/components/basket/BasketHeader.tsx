import React from 'react';
import { Users, Settings, Share2, Target, Calendar } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
interface BasketHeaderProps {
  basket: {
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
  return <GlassCard className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 rounded-xl bg-gradient-purple-pink flex items-center justify-center">
            <span className="text-2xl font-bold text-white">
              {basket.name.charAt(0)}
            </span>
          </div>
          <div>
            <h1 className="font-bold gradient-text text-xl">{basket.name}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{basket.participants} members</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{basket.daysLeft} days left</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={onShare} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
          {basket.isOwner && <button onClick={onSettings} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
              <Settings className="w-5 h-5" />
            </button>}
        </div>
      </div>

      <p className="text-gray-300 mb-6">{basket.description}</p>

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
          <span className="text-gray-400">RWF {basket.totalContributions.toLocaleString()}</span>
          <div className="flex items-center gap-1 text-gray-400">
            <Target className="w-4 h-4" />
            <span>RWF {basket.goal.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </GlassCard>;
};