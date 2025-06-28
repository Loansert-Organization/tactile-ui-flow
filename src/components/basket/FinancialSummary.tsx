
import React from 'react';
import { Banknote, Coins } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { formatCurrency } from '@/lib/formatters';
interface FinancialSummaryProps {
  totalContributions: number;
  bankBalance: number;
  myContribution: number;
}
export const FinancialSummary = ({
  totalContributions,
  bankBalance,
  myContribution
}: FinancialSummaryProps) => {
  return <>
      <h2 className="text-lg font-semibold mb-4">Financial Summary</h2>
      <div className="space-y-4 mb-6">
        <GlassCard className="p-4 text-center w-full">
          <div className="flex items-center justify-center mb-2">
            
          </div>
          <div className="text-xl font-bold gradient-text mb-1">
            {formatCurrency(totalContributions)}
          </div>
          <div className="text-sm text-gray-400">Total Contributions</div>
        </GlassCard>
        
        <GlassCard variant="subtle" className="p-4 text-center w-full bg-blue-500/10 border-blue-500/30">
          <div className="text-xl font-bold gradient-text mb-1">
            {formatCurrency(myContribution)}
          </div>
          <div className="text-sm text-gray-400">My Contribution</div>
        </GlassCard>
      </div>
    </>;
};
