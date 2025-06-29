import React, { useState, useEffect } from 'react';
import { Wallet, DollarSign, TrendingUp, TrendingDown, Search, Plus, Minus } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/formatters';

interface Wallet {
  id: string;
  user_id: string;
  balance_usd: number;
  created_at: string;
  users: {
    display_name: string;
    country: string;
  };
}

interface Transaction {
  id: string;
  amount_usd: number;
  type: string;
  description?: string;
  created_at: string;
  basket_id?: string;
}

const AdminWallets: React.FC = () => {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [adjustmentAmount, setAdjustmentAmount] = useState('');
  const [adjustmentReason, setAdjustmentReason] = useState('');

  const fetchWallets = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('wallets')
        .select(`
          id,
          user_id,
          balance_usd,
          created_at,
          users!inner(
            display_name,
            country
          )
        `)
        .order('balance_usd', { ascending: false });

      if (error) throw error;
      setWallets(data || []);
    } catch (error: any) {
      console.error('[ADMIN_WALLETS] Fetch error:', error);
      toast.error('Failed to load wallets');
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async (walletId: string) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('wallet_id', walletId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setTransactions(data || []);
    } catch (error: any) {
      console.error('[ADMIN_WALLETS] Transaction fetch error:', error);
      toast.error('Failed to load transactions');
    }
  };

  const adjustBalance = async (walletId: string, amount: number, reason: string) => {
    try {
      // First, add a transaction record
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert([{
          wallet_id: walletId,
          amount_usd: amount,
          type: amount > 0 ? 'admin_credit' : 'admin_debit',
          description: reason || 'Admin adjustment',
        }]);

      if (transactionError) throw transactionError;

      // Then update the wallet balance
      const currentWallet = wallets.find(w => w.id === walletId);
      if (!currentWallet) throw new Error('Wallet not found');

      const newBalance = currentWallet.balance_usd + amount;
      const { error: walletError } = await supabase
        .from('wallets')
        .update({ balance_usd: newBalance })
        .eq('id', walletId);

      if (walletError) throw walletError;

      toast.success(`Balance adjusted by ${formatCurrency(amount)}`);
      fetchWallets();
      setAdjustmentAmount('');
      setAdjustmentReason('');
    } catch (error: any) {
      console.error('[ADMIN_WALLETS] Balance adjustment error:', error);
      toast.error('Failed to adjust balance');
    }
  };

  useEffect(() => {
    fetchWallets();
  }, []);

  const filteredWallets = wallets.filter(wallet =>
    wallet.users.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    wallet.users.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalBalance = wallets.reduce((sum, wallet) => sum + wallet.balance_usd, 0);
  const activeWallets = wallets.filter(w => w.balance_usd > 0).length;

  if (loading) {
    return <GlassCard className="p-6">Loading wallets...</GlassCard>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wallet className="w-6 h-6" />
          <h1 className="text-2xl font-bold">Wallet Management</h1>
        </div>
        <Badge variant="outline">
          {filteredWallets.length} wallets
        </Badge>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassCard className="p-4">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-500" />
            <div>
              <p className="text-sm text-muted-foreground">Total Balance</p>
              <p className="text-xl font-bold">{formatCurrency(totalBalance)}</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard className="p-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-sm text-muted-foreground">Active Wallets</p>
              <p className="text-xl font-bold">{activeWallets}</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard className="p-4">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-purple-500" />
            <div>
              <p className="text-sm text-muted-foreground">Avg Balance</p>
              <p className="text-xl font-bold">{formatCurrency(totalBalance / (wallets.length || 1))}</p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Search */}
      <GlassCard className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search wallets by user name or country..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </GlassCard>

      {/* Wallets Table */}
      <GlassCard className="p-0 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredWallets.map((wallet) => (
              <TableRow key={wallet.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-primary" />
                    <p className="font-medium">{wallet.users.display_name}</p>
                  </div>
                </TableCell>
                <TableCell>{wallet.users.country}</TableCell>
                <TableCell>
                  <Badge variant={wallet.balance_usd > 0 ? 'default' : 'secondary'}>
                    {formatCurrency(wallet.balance_usd)}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(wallet.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setSelectedWallet(wallet);
                            fetchTransactions(wallet.id);
                          }}
                        >
                          View History
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>
                            Wallet History - {selectedWallet?.users.display_name}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="p-4 bg-muted rounded-lg">
                            <p className="text-sm text-muted-foreground">Current Balance</p>
                            <p className="text-2xl font-bold">{formatCurrency(selectedWallet?.balance_usd || 0)}</p>
                          </div>
                          
                          <div className="space-y-2">
                            <h4 className="font-semibold">Recent Transactions</h4>
                            <div className="max-h-60 overflow-y-auto">
                              {transactions.map((transaction) => (
                                <div key={transaction.id} className="flex items-center justify-between p-2 border rounded">
                                  <div className="flex items-center gap-2">
                                    {transaction.amount_usd > 0 ? (
                                      <TrendingUp className="w-4 h-4 text-green-500" />
                                    ) : (
                                      <TrendingDown className="w-4 h-4 text-red-500" />
                                    )}
                                    <div>
                                      <p className="text-sm font-medium">{transaction.type}</p>
                                      {transaction.description && (
                                        <p className="text-xs text-muted-foreground">{transaction.description}</p>
                                      )}
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className={`font-medium ${transaction.amount_usd > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                      {transaction.amount_usd > 0 ? '+' : ''}{formatCurrency(transaction.amount_usd)}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                      {new Date(transaction.created_at).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          Adjust Balance
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Adjust Balance - {wallet.users.display_name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <p className="text-sm text-muted-foreground mb-2">
                              Current Balance: {formatCurrency(wallet.balance_usd)}
                            </p>
                          </div>
                          <div>
                            <label className="text-sm font-medium">Adjustment Amount</label>
                            <Input
                              type="number"
                              placeholder="Enter amount (+ for credit, - for debit)"
                              value={adjustmentAmount}
                              onChange={(e) => setAdjustmentAmount(e.target.value)}
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Reason</label>
                            <Input
                              placeholder="Reason for adjustment"
                              value={adjustmentReason}
                              onChange={(e) => setAdjustmentReason(e.target.value)}
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => {
                                const amount = parseFloat(adjustmentAmount);
                                if (amount && adjustmentReason) {
                                  adjustBalance(wallet.id, amount, adjustmentReason);
                                }
                              }}
                              disabled={!adjustmentAmount || !adjustmentReason}
                            >
                              Apply Adjustment
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </GlassCard>

      {filteredWallets.length === 0 && !loading && (
        <GlassCard className="p-12 text-center">
          <Wallet className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">No wallets found matching your criteria.</p>
        </GlassCard>
      )}
    </div>
  );
};

export default AdminWallets; 