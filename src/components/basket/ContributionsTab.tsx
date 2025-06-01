
import React from 'react';
import { Clock } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatCurrency } from '@/lib/formatters';

interface Contribution {
  id: string;
  memberCode: string;
  amount: number;
  timestamp: Date;
  message?: string;
}

interface ContributionsTabProps {
  contributions: Contribution[];
}

export const ContributionsTab = ({ contributions }: ContributionsTabProps) => {
  const formatTimeAgo = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    return `${days} days ago`;
  };

  return (
    <GlassCard className="p-6">
      <h3 className="text-lg font-semibold mb-4 truncate">Recent Contributions</h3>
      
      <ScrollArea className="h-96">
        <div className="space-y-4">
          {contributions.map((contribution) => (
            <div key={contribution.id} className="flex items-start gap-3 p-3 rounded-lg bg-white/5">
              <div className="w-8 h-8 rounded-full bg-gradient-teal-blue flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold">{contribution.memberCode.slice(-2)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium truncate">{formatCurrency(contribution.amount)}</span>
                  <div className="flex items-center gap-1 text-xs text-gray-400 flex-shrink-0">
                    <Clock className="w-3 h-3" />
                    <span className="whitespace-nowrap">{formatTimeAgo(contribution.timestamp)}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-400 truncate">Code: {contribution.memberCode}</p>
                {contribution.message && (
                  <p className="text-sm text-gray-300 mt-1 line-clamp-2">"{contribution.message}"</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </GlassCard>
  );
};
