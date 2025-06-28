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
      <div className="grid grid-cols-2 gap-4 mb-6">
        <GlassCard className="p-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <Coins className="w-6 h-6 text-blue-400" />
          </div>
          <div className="text-xl font-bold gradient-text mb-1">
            {formatCurrency(totalContributions)}
          </div>
          <div className="text-sm text-gray-400">Total Contributions</div>
        </GlassCard>
        
      </div>

      {/* My Contribution */}
      <GlassCard className="p-4 text-center">
        <div className="text-xl font-bold gradient-text mb-1">
          {formatCurrency(myContribution)}
        </div>
        <div className="text-sm text-gray-400">My Contribution</div>
      </GlassCard>
    </>;
};