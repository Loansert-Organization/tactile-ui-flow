
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { Input } from '@/components/ui/input';
import { GlassCard } from '@/components/ui/glass-card';

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden safe-area-full">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />
      <div className="absolute top-1/3 left-1/4 w-64 h-64 sm:w-80 sm:h-80 bg-purple-500/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/3 w-48 h-48 sm:w-64 sm:h-64 bg-blue-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />

      {/* Header */}
      <div className="relative z-10 responsive-padding">
        <div className="flex items-center gap-3 mb-6">
          <EnhancedButton
            variant="glass"
            size="icon"
            onClick={handleBackClick}
            className="rounded-full touch-target"
            aria-label="Go back"
          >
            <ArrowLeft className="w-6 h-6" />
          </EnhancedButton>
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
              className="pl-10 glass-input text-white placeholder-gray-400 border-white/20 focus-gradient"
            />
          </div>
          
          <div className="flex gap-2">
            <EnhancedButton
              variant={filter === 'all' ? 'gradient-primary' : 'glass'}
              size="sm"
              onClick={() => setFilter('all')}
              className="touch-target"
            >
              All
            </EnhancedButton>
            <EnhancedButton
              variant={filter === 'sent' ? 'gradient-primary' : 'glass'}
              size="sm"
              onClick={() => setFilter('sent')}
              className="touch-target"
            >
              Sent
            </EnhancedButton>
            <EnhancedButton
              variant={filter === 'received' ? 'gradient-primary' : 'glass'}
              size="sm"
              onClick={() => setFilter('received')}
              className="touch-target"
            >
              Received
            </EnhancedButton>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="relative z-10 container-fluid pb-24 space-y-4">
        {filteredTransactions.length === 0 ? (
          <GlassCard variant="strong" className="responsive-padding text-center">
            <Clock className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-300 text-base">No transactions found</p>
          </GlassCard>
        ) : (
          filteredTransactions.map((transaction, index) => (
            <GlassCard
              key={transaction.id}
              variant="default"
              hover
              className="responsive-padding animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 w-3/5 pr-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-white text-sm">
                      {generateUniqueCode(transaction.recipientId || transaction.recipient)}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                      transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {transaction.status}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-300 mb-2 truncate leading-relaxed">
                    {getTransactionMessage(transaction)}
                  </p>
                  
                  <p className="text-xs text-gray-400">
                    {formatDate(transaction.timestamp)}
                  </p>
                </div>
                
                <div className="text-right w-2/5 flex-shrink-0">
                  <p className={`font-bold text-base ${
                    transaction.type === 'sent' ? 'text-red-400' : 'text-green-400'
                  }`}>
                    {transaction.type === 'sent' ? '-' : '+'}
                    {transaction.amount.toLocaleString()} RWF
                  </p>
                  <p className="text-xs text-gray-400 capitalize font-medium">
                    {transaction.type}
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
