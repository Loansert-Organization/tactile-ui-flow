import React from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { formatCurrency } from '@/lib/formatters';

interface Props { balance: number | null; }

export const WalletCard: React.FC<Props> = ({ balance }) => (
  <GlassCard className="p-4 flex items-center justify-between">
    <div>
      <h4 className="text-sm text-gray-400">Wallet Balance</h4>
      <p className="text-xl font-bold gradient-text-blue">{formatCurrency(balance || 0)}</p>
    </div>
  </GlassCard>
); 