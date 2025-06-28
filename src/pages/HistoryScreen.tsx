
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { GlassCard } from '@/components/ui/glass-card';
import { Badge } from '@/components/ui/badge';

interface Transaction {
  id: string;
  amount: number;
  recipient: string;
  message?: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
  type: 'sent' | 'received';
}

export const HistoryScreen = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'sent' | 'received'>('all');

  useEffect(() => {
    // Dummy data for demonstration
    const dummyTransactions: Transaction[] = [
      {
        id: '1',
        amount: 15000,
        recipient: 'John Doe',
        message: 'Lunch payment',
        timestamp: '2024-01-15T10:30:00Z',
        status: 'completed',
        type: 'sent'
      },
      {
        id: '2',
        amount: 25000,
        recipient: 'Jane Smith',
        timestamp: '2024-01-14T14:20:00Z',
        status: 'completed',
        type: 'received'
      },
      {
        id: '3',
        amount: 8000,
        recipient: 'Bob Wilson',
        message: 'Transport fee',
        timestamp: '2024-01-13T09:15:00Z',
        status: 'pending',
        type: 'sent'
      },
      {
        id: '4',
        amount: 50000,
        recipient: 'Alice Johnson',
        message: 'Monthly rent',
        timestamp: '2024-01-12T16:45:00Z',
        status: 'completed',
        type: 'sent'
      }
    ];
    
    setTransactions(dummyTransactions);
  }, []);

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
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
              placeholder="Search transactions..."
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
              variant={filter === 'sent' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('sent')}
              className={filter === 'sent' ? '' : 'bg-white/10 border-white/20 hover:bg-white/20'}
            >
              Sent
            </Button>
            <Button
              variant={filter === 'received' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('received')}
              className={filter === 'received' ? '' : 'bg-white/10 border-white/20 hover:bg-white/20'}
            >
              Received
            </Button>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="px-6 space-y-4">
        {filteredTransactions.length === 0 ? (
          <GlassCard className="p-6 text-center">
            <Clock className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p className="text-gray-500">No transactions found</p>
          </GlassCard>
        ) : (
          filteredTransactions.map((transaction, index) => (
            <GlassCard key={transaction.id} className="p-4 animate-slide-up" style={{
              animationDelay: `${index * 100}ms`
            }}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900">
                      {transaction.recipient}
                    </span>
                    <Badge className={getStatusColor(transaction.status)}>
                      {transaction.status}
                    </Badge>
                  </div>
                  
                  {transaction.message && (
                    <p className="text-sm text-gray-600 mb-2">
                      {transaction.message}
                    </p>
                  )}
                  
                  <p className="text-xs text-gray-500">
                    {formatDate(transaction.timestamp)}
                  </p>
                </div>
                
                <div className="text-right">
                  <p className={`font-semibold ${
                    transaction.type === 'sent' 
                      ? 'text-red-600' 
                      : 'text-green-600'
                  }`}>
                    {transaction.type === 'sent' ? '-' : '+'}
                    {transaction.amount.toLocaleString()} RWF
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
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
