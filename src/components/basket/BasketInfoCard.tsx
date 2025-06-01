
import React from 'react';
import { Users, Calendar, Target, Lock, Globe } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Progress } from '@/components/ui/progress';
import { formatCurrency } from '@/lib/formatters';

interface BasketData {
  id: string;
  name: string;
  description: string;
  type: 'private' | 'public';
  goal: number;
  currentAmount: number;
  progress: number;
  daysLeft: number;
  privacy: 'private' | 'public';
  members: any[];
}

interface BasketInfoCardProps {
  basketData: BasketData;
}

export const BasketInfoCard = ({ basketData }: BasketInfoCardProps) => {
  return (
    <GlassCard className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold gradient-text mb-2">{basketData.name}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{basketData.members.length} members</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{basketData.daysLeft} days left</span>
            </div>
            <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-purple-500/20 text-purple-400 text-xs">
              {basketData.type === 'private' ? (
                <>
                  <Lock className="w-3 h-3" />
                  <span>Private</span>
                </>
              ) : (
                <>
                  <Globe className="w-3 h-3" />
                  <span>Public</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <p className="text-gray-300 mb-6">{basketData.description}</p>

      {/* Progress */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Progress</span>
          <span className="font-semibold gradient-text-blue">{basketData.progress}%</span>
        </div>
        
        <Progress value={basketData.progress} className="h-3" />

        <div className="flex items-center justify-between text-sm">
          {basketData.privacy === 'private' ? (
            <span className="text-gray-400 italic">Balance hidden for private baskets</span>
          ) : (
            <span className="text-gray-400">{formatCurrency(basketData.currentAmount)}</span>
          )}
          <div className="flex items-center gap-1 text-gray-400">
            <Target className="w-4 h-4" />
            <span>{formatCurrency(basketData.goal)}</span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};
