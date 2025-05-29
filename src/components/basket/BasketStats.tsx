
import React from 'react';
import { GlassCard } from '@/components/ui/glass-card';

interface BasketStatsProps {
  totalContributions: number;
  participants: number;
  goal: number;
}

export const BasketStats = ({ totalContributions, participants, goal }: BasketStatsProps) => {
  return (
    <>
      <h2 className="text-lg font-semibold mb-4">Statistics</h2>
      <div className="grid grid-cols-2 gap-4">
        <GlassCard className="p-4 text-center">
          <div className="text-xl font-bold gradient-text mb-1">
            RWF {Math.round(totalContributions / participants).toLocaleString()}
          </div>
          <div className="text-sm text-gray-400">Avg per member</div>
        </GlassCard>
        <GlassCard className="p-4 text-center">
          <div className="text-xl font-bold gradient-text mb-1">
            RWF {(goal - totalContributions).toLocaleString()}
          </div>
          <div className="text-sm text-gray-400">Remaining</div>
        </GlassCard>
      </div>
    </>
  );
};
