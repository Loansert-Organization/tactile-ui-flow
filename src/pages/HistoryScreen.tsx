import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GlassCard } from '@/components/ui/glass-card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface Transaction {
  id: string;
  amount_usd: number;
  type: 'contribution' | 'topup' | 'withdrawal';
  related_basket?: string;
  created_at: string;
  basket_name?: string;
  status: 'completed' | 'pending' | 'failed';
}

export const HistoryScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'contribution' | 'topup' | 'withdrawal'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch transaction history
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user?.id) return;

      setLoading(true);
      setError(null);

      try {
        // First get user's wallet
        const { data: walletData, error: walletError } = await supabase
          .from('wallets')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (walletError) {
          if (import.meta.env.DEV) console.error('Error fetching wallet:', walletError);
          setError('Failed to load transaction history');
          return;
        }

        // Fetch transactions
        const { data: transactionData, error: transactionError } = await supabase
          .from('transactions')
          .select('*')
          .eq('wallet_id', walletData.id)
          .order('created_at', { ascending: false })
          .limit(50);

        if (transactionError) {
          if (import.meta.env.DEV) console.error('Error fetching transactions:', transactionError);
          setError('Failed to load transaction history');
          return;
        }

        // Fetch basket names for related transactions
        const transactionsWithBasketNames = await Promise.all(
          (transactionData || []).map(async (transaction) => {
            if (transaction.related_basket) {
              const { data: basketData } = await supabase
                .from('baskets')
                .select('name')
                .eq('id', transaction.related_basket)
                .single();

              return {
                ...transaction,
                basket_name: basketData?.name,
                status: 'completed' as const // All transactions in DB are completed
              };
            }
            return {
              ...transaction,
              status: 'completed' as const
            };
          })
        );

        setTransactions(transactionsWithBasketNames);

      } catch (err) {
        if (import.meta.env.DEV) console.error('Transaction fetch error:', err);
        setError('Failed to load transaction history');
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [user?.id]);

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.basket_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || transaction.type === filter;
    return matchesSearch && matchesFilter;
  });

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTransactionMessage = (transaction: Transaction) => {
    const amountRwf = Math.round(transaction.amount_usd * 1300); // Convert USD to RWF
    
    switch (transaction.type) {
      case 'contribution':
        return transaction.basket_name 
          ? `Contribution to ${transaction.basket_name}`
          : 'Basket contribution';
      case 'topup':
        return `Wallet top-up`;
      case 'withdrawal':
        return `Wallet withdrawal`;
      default:
        return 'Transaction';
    }
  };

  const getAmountDisplay = (transaction: Transaction) => {
    const amountRwf = Math.round(transaction.amount_usd * 1300);
    const isNegative = transaction.type === 'contribution' || transaction.type === 'withdrawal';
    return `${isNegative ? '-' : '+'}${amountRwf.toLocaleString()} RWF`;
  };

  const handleBackClick = () => {
    if (import.meta.env.DEV) console.log('Back button clicked');
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="min-h-screen pb-24">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <Skeleton className="h-8 w-48" />
          </div>
          <div className="space-y-3 mb-6">
            <Skeleton className="h-10 w-full" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
        </div>
        <div className="px-6 space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={handleBackClick}
            className="p-3 rounded-lg hover:bg-white/20 active:bg-white/30 transition-all duration-200 touch-manipulation cursor-pointer"
            aria-label="Go back"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold gradient-text">Transaction History</h1>
        </div>

        {/* Search and Filter */}
        <div className="space-y-3 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search baskets or transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 backdrop-blur-md"
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
              className={filter === 'all' ? '' : 'bg-white/10 border-white/20 hover:bg-white/20'}
            >
              All
            </Button>
            <Button
              variant={filter === 'contribution' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('contribution')}
              className={filter === 'contribution' ? '' : 'bg-white/10 border-white/20 hover:bg-white/20'}
            >
              Contributions
            </Button>
            <Button
              variant={filter === 'topup' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('topup')}
              className={filter === 'topup' ? '' : 'bg-white/10 border-white/20 hover:bg-white/20'}
            >
              Top-ups
            </Button>
            <Button
              variant={filter === 'withdrawal' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('withdrawal')}
              className={filter === 'withdrawal' ? '' : 'bg-white/10 border-white/20 hover:bg-white/20'}
            >
              Withdrawals
            </Button>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="px-6 space-y-4">
        {error ? (
          <GlassCard className="p-6 text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              Retry
            </button>
          </GlassCard>
        ) : filteredTransactions.length === 0 ? (
          <GlassCard className="p-6 text-center">
            <Clock className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p className="text-gray-500">No transactions found</p>
          </GlassCard>
        ) : (
          filteredTransactions.map((transaction, index) => (
            <GlassCard key={transaction.id} className="p-4 animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium truncate">{getTransactionMessage(transaction)}</p>
                    <Badge className={getStatusColor(transaction.status)}>
                      {transaction.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-400">{formatDate(transaction.created_at)}</p>
                </div>
                <div className="text-right ml-4">
                  <p className={`font-bold ${transaction.type === 'contribution' || transaction.type === 'withdrawal' ? 'text-red-500' : 'text-green-500'}`}>
                    {getAmountDisplay(transaction)}
                  </p>
                  <p className="text-xs text-gray-400">
                    {transaction.amount_usd.toFixed(2)} USD
                  </p>
                </div>
              </div>
            </GlassCard>
          ))
        )}
      </div>
    </div>
  );
};
