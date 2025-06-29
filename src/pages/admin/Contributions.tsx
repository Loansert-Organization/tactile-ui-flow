import React, { useState, useEffect } from 'react';
import { CreditCard, Search, Calendar, DollarSign, CheckCircle, XCircle, Clock } from 'lucide-react';
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

interface Contribution {
  id: string;
  amount_local: number;
  amount_usd: number;
  currency: string;
  payment_method: string;
  momo_code?: string;
  confirmed: boolean;
  created_at: string;
  basket_id: string;
  user_id: string;
  users: {
    display_name: string;
    country: string;
  };
  baskets: {
    name: string;
    category: string;
  };
}

const AdminContributions: React.FC = () => {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>('all');
  const [selectedContribution, setSelectedContribution] = useState<Contribution | null>(null);

  const fetchContributions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('contributions')
        .select(`
          id,
          amount_local,
          amount_usd,
          currency,
          payment_method,
          momo_code,
          confirmed,
          created_at,
          basket_id,
          user_id,
          users!inner(
            display_name,
            country
          ),
          baskets!inner(
            name,
            category
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContributions(data || []);
    } catch (error: any) {
      console.error('[ADMIN_CONTRIBUTIONS] Fetch error:', error);
      toast.error('Failed to load contributions');
    } finally {
      setLoading(false);
    }
  };

  const updateContributionStatus = async (contributionId: string, confirmed: boolean) => {
    try {
      const { error } = await supabase
        .from('contributions')
        .update({ confirmed })
        .eq('id', contributionId);

      if (error) throw error;
      
      toast.success(`Contribution ${confirmed ? 'confirmed' : 'rejected'}`);
      fetchContributions();
    } catch (error: any) {
      console.error('[ADMIN_CONTRIBUTIONS] Status update error:', error);
      toast.error('Failed to update contribution status');
    }
  };

  useEffect(() => {
    fetchContributions();
  }, []);

  const filteredContributions = contributions.filter(contribution => {
    const matchesSearch = contribution.users.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contribution.baskets.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (contribution.momo_code && contribution.momo_code.includes(searchTerm));
    
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'confirmed' && contribution.confirmed) ||
                         (statusFilter === 'pending' && !contribution.confirmed);
    
    const matchesPaymentMethod = paymentMethodFilter === 'all' || contribution.payment_method === paymentMethodFilter;
    
    return matchesSearch && matchesStatus && matchesPaymentMethod;
  });

  const totalContributions = contributions.length;
  const confirmedContributions = contributions.filter(c => c.confirmed).length;
  const pendingContributions = contributions.filter(c => !c.confirmed).length;
  const totalAmount = contributions
    .filter(c => c.confirmed)
    .reduce((sum, contribution) => sum + contribution.amount_usd, 0);

  if (loading) {
    return <GlassCard className="p-6">Loading contributions...</GlassCard>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CreditCard className="w-6 h-6" />
          <h1 className="text-2xl font-bold">Contribution Management</h1>
        </div>
        <Badge variant="outline">
          {confirmedContributions} confirmed / {totalContributions} total
        </Badge>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <GlassCard className="p-4">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-sm text-muted-foreground">Total Contributions</p>
              <p className="text-xl font-bold">{totalContributions}</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard className="p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <div>
              <p className="text-sm text-muted-foreground">Confirmed</p>
              <p className="text-xl font-bold">{confirmedContributions}</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard className="p-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-orange-500" />
            <div>
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-xl font-bold">{pendingContributions}</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard className="p-4">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-purple-500" />
            <div>
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p className="text-xl font-bold">{formatCurrency(totalAmount)}</p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Filters */}
      <GlassCard className="p-4">
        <div className="flex gap-4 items-center">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by contributor, basket, or MoMo code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
          <Select value={paymentMethodFilter} onValueChange={setPaymentMethodFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Methods</SelectItem>
              <SelectItem value="ussd">USSD</SelectItem>
              <SelectItem value="mobile_money">Mobile Money</SelectItem>
              <SelectItem value="card">Card</SelectItem>
              <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </GlassCard>

      {/* Contributions Table */}
      <GlassCard className="p-0 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Contributor</TableHead>
              <TableHead>Basket</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredContributions.map((contribution) => (
              <TableRow key={contribution.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{contribution.users.display_name}</p>
                    <p className="text-xs text-muted-foreground">{contribution.users.country}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{contribution.baskets.name}</p>
                    <p className="text-xs text-muted-foreground">{contribution.baskets.category}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{formatCurrency(contribution.amount_local)} {contribution.currency}</p>
                    <p className="text-xs text-muted-foreground">≈ {formatCurrency(contribution.amount_usd)}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{contribution.payment_method}</Badge>
                  {contribution.momo_code && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Code: {contribution.momo_code.substring(0, 10)}...
                    </p>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={contribution.confirmed ? 'default' : 'secondary'}>
                    {contribution.confirmed ? (
                      <div className="flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Confirmed
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Pending
                      </div>
                    )}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-muted-foreground" />
                    <span className="text-sm">
                      {new Date(contribution.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(contribution.created_at).toLocaleTimeString()}
                  </p>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setSelectedContribution(contribution)}
                        >
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Contribution Details</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium">Contributor</p>
                              <p className="text-sm text-muted-foreground">{selectedContribution?.users.display_name}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Country</p>
                              <p className="text-sm text-muted-foreground">{selectedContribution?.users.country}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Basket</p>
                              <p className="text-sm text-muted-foreground">{selectedContribution?.baskets.name}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Category</p>
                              <p className="text-sm text-muted-foreground">{selectedContribution?.baskets.category}</p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium">Local Amount</p>
                              <p className="text-lg font-bold">
                                {selectedContribution && formatCurrency(selectedContribution.amount_local)} {selectedContribution?.currency}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">USD Amount</p>
                              <p className="text-lg font-bold">
                                {selectedContribution && formatCurrency(selectedContribution.amount_usd)}
                              </p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium">Payment Method</p>
                              <p className="text-sm text-muted-foreground">{selectedContribution?.payment_method}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Status</p>
                              <Badge variant={selectedContribution?.confirmed ? 'default' : 'secondary'}>
                                {selectedContribution?.confirmed ? 'Confirmed' : 'Pending'}
                              </Badge>
                            </div>
                          </div>
                          
                          {selectedContribution?.momo_code && (
                            <div>
                              <p className="text-sm font-medium">MoMo Code</p>
                              <code className="text-xs bg-muted px-2 py-1 rounded block break-all">
                                {selectedContribution.momo_code}
                              </code>
                            </div>
                          )}
                          
                          <div>
                            <p className="text-sm font-medium">Date & Time</p>
                            <p className="text-sm text-muted-foreground">
                              {selectedContribution && new Date(selectedContribution.created_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    {!contribution.confirmed && (
                      <div className="flex gap-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => updateContributionStatus(contribution.id, true)}
                          className="text-green-600 hover:text-green-700"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => updateContributionStatus(contribution.id, false)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </GlassCard>

      {filteredContributions.length === 0 && !loading && (
        <GlassCard className="p-12 text-center">
          <CreditCard className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">No contributions found matching your criteria.</p>
        </GlassCard>
      )}
    </div>
  );
};

export default AdminContributions; 