
import React from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { formatCurrency, formatAmount } from '@/lib/formatters';

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
        <GlassCard className="p-3 text-center">
          <div className="text-base font-bold gradient-text mb-1">
            {formatCurrency(Math.round(totalContributions / participants))}
          </div>
          <div className="text-xs text-gray-400">Avg per member</div>
        </GlassCard>
        <GlassCard className="p-3 text-center">
          <div className="text-base font-bold gradient-text mb-1">
            {formatCurrency(goal - totalContributions)}
          </div>
          <div className="text-xs text-gray-400">Remaining</div>
        </GlassCard>
      </div>
    </>
  );
};
