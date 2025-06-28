
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GlassCard } from '@/components/ui/glass-card';
import { Badge } from '@/components/ui/badge';
import { EnhancedButton } from '@/components/ui/enhanced-button';

interface Transaction {
  id: string;
  amount: number;
  recipient: string;
  recipientId?: string;
  message?: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
  type: 'sent' | 'received';
  basketName?: string;
  isBasketTransaction?: boolean;
}

export const HistoryScreen = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'sent' | 'received'>('all');

  // Generate unique code based on user ID or name
  const generateUniqueCode = (identifier: string) => {
    const prefix = 'USR';
    const hash = identifier.split('').reduce((a, b) => {
      a = (a << 5) - a + b.charCodeAt(0);
      return a & a;
    }, 0);
    const code = Math.abs(hash).toString().padStart(6, '0').slice(-6);
    return `${prefix}${code}`;
  };

  useEffect(() => {
    // Updated dummy data with cleaner basket/wallet descriptions
    const dummyTransactions: Transaction[] = [
      {
        id: '1',
        amount: 15000,
        recipient: 'John Doe',
        recipientId: 'user_john_123',
        basketName: 'Lakers Championship Ring Fund',
        isBasketTransaction: true,
        timestamp: '2024-01-15T10:30:00Z',
        status: 'completed',
        type: 'sent'
      },
      {
        id: '2',
        amount: 25000,
        recipient: 'Jane Smith',
        recipientId: 'user_jane_456',
        basketName: 'Emergency Medical Fund',
        isBasketTransaction: true,
        timestamp: '2024-01-14T14:20:00Z',
        status: 'completed',
        type: 'received'
      },
      {
        id: '3',
        amount: 8000,
        recipient: 'Bob Wilson',
        recipientId: 'user_bob_789',
        basketName: 'Community Garden Project',
        isBasketTransaction: true,
        timestamp: '2024-01-13T09:15:00Z',
        status: 'pending',
        type: 'sent'
      },
      {
        id: '4',
        amount: 50000,
        recipient: 'Alice Johnson',
        recipientId: 'user_alice_101',
        isBasketTransaction: false,
        timestamp: '2024-01-12T16:45:00Z',
        status: 'completed',
        type: 'sent'
      }
    ];
    setTransactions(dummyTransactions);
  }, []);

  const filteredTransactions = transactions.filter(transaction => {
    const userCode = generateUniqueCode(transaction.recipientId || transaction.recipient);
    const matchesSearch = userCode.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         transaction.basketName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.message?.toLowerCase().includes(searchTerm.toLowerCase());
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

  const getTransactionMessage = (transaction: Transaction) => {
    if (transaction.isBasketTransaction && transaction.basketName) {
      return transaction.basketName;
    } else {
      const userCode = generateUniqueCode(transaction.recipientId || transaction.recipient);
      return transaction.type === 'sent' 
        ? `Wallet transfer to ${userCode}` 
        : `Wallet receipt from ${userCode}`;
    }
  };

  const handleBackClick = () => {
    console.log('Back button clicked');
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <div className="sticky top-0 z-50 backdrop-blur-lg border-b border-white/10">
        <GlassCard variant="subtle" className="m-2 px-4 py-3 rounded-xl">
          <div className="flex items-center gap-3">
            <EnhancedButton
              onClick={handleBackClick}
              variant="ghost"
              size="icon"
              className="hover:bg-white/10"
              aria-label="Go back"
            >
              <ArrowLeft className="w-6 h-6" />
            </EnhancedButton>
            <h1 className="text-2xl font-bold gradient-text">Transaction History</h1>
          </div>
        </GlassCard>
      </div>

      <div className="p-4 sm:p-6 space-y-6">
        {/* Search and Filter */}
        <GlassCard variant="default" className="space-y-4 animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/60" />
            <Input
              placeholder="Search baskets or transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 backdrop-blur-md text-white placeholder-white/60"
            />
          </div>
          
          <div className="flex gap-2">
            <EnhancedButton
              variant={filter === 'all' ? 'gradient' : 'glass'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All
            </EnhancedButton>
            <EnhancedButton
              variant={filter === 'sent' ? 'gradient' : 'glass'}
              size="sm"
              onClick={() => setFilter('sent')}
            >
              Sent
            </EnhancedButton>
            <EnhancedButton
              variant={filter === 'received' ? 'gradient' : 'glass'}
              size="sm"
              onClick={() => setFilter('received')}
            >
              Received
            </EnhancedButton>
          </div>
        </GlassCard>

        {/* Transactions List */}
        <div className="space-y-4">
          {filteredTransactions.length === 0 ? (
            <GlassCard variant="default" className="p-8 text-center animate-scale-in">
              <Clock className="w-16 h-16 mx-auto mb-4 text-white/60" />
              <p className="text-white/80 text-lg font-medium">No transactions found</p>
              <p className="text-white/60 text-sm mt-2">Try adjusting your search or filters</p>
            </GlassCard>
          ) : (
            filteredTransactions.map((transaction, index) => (
              <GlassCard
                key={transaction.id}
                variant="default"
                className="animate-slide-up"
                style={{ animationDelay: `${(index + 2) * 100}ms` }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-mono font-semibold text-white text-sm">
                        {generateUniqueCode(transaction.recipientId || transaction.recipient)}
                      </span>
                      <Badge 
                        className={`text-xs ${
                          transaction.status === 'completed' 
                            ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                            : transaction.status === 'pending'
                            ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                            : 'bg-red-500/20 text-red-400 border-red-500/30'
                        }`}
                      >
                        {transaction.status}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-white/80 mb-2 line-clamp-2">
                      {getTransactionMessage(transaction)}
                    </p>
                    
                    <p className="text-xs text-white/60">
                      {formatDate(transaction.timestamp)}
                    </p>
                  </div>
                  
                  <div className="text-right flex-shrink-0">
                    <p className={`font-semibold text-lg ${
                      transaction.type === 'sent' ? 'text-red-400' : 'text-green-400'
                    }`}>
                      {transaction.type === 'sent' ? '-' : '+'}
                      {transaction.amount.toLocaleString()} RWF
                    </p>
                    <p className="text-xs text-white/60 capitalize mt-1">
                      {transaction.type}
                    </p>
                  </div>
                </div>
              </GlassCard>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
