import React, { useState, useEffect } from 'react';
import { Package, Edit, Trash2, Search, Users, DollarSign, Calendar, Eye } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/formatters';

interface Basket {
  id: string;
  name: string;
  description: string;
  goal_amount: number;
  current_amount: number;
  currency: string;
  category: string;
  country: string;
  is_private: boolean;
  public: boolean;
  status: string;
  created_at: string;
  creator_id: string;
  participants_count: number;
  users: {
    display_name: string;
  };
}

const AdminBaskets: React.FC = () => {
  const [baskets, setBaskets] = useState<Basket[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedBasket, setSelectedBasket] = useState<Basket | null>(null);

  const fetchBaskets = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('baskets')
        .select(`
          id,
          name,
          description,
          goal_amount,
          current_amount,
          currency,
          category,
          country,
          is_private,
          public,
          status,
          created_at,
          creator_id,
          participants_count,
          users!inner(
            display_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBaskets(data || []);
    } catch (error: any) {
      console.error('[ADMIN_BASKETS] Fetch error:', error);
      toast.error('Failed to load baskets');
    } finally {
      setLoading(false);
    }
  };

  const updateBasketStatus = async (basketId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('baskets')
        .update({ status: newStatus })
        .eq('id', basketId);

      if (error) throw error;
      toast.success(`Basket status updated to ${newStatus}`);
      fetchBaskets();
    } catch (error: any) {
      console.error('[ADMIN_BASKETS] Status update error:', error);
      toast.error('Failed to update basket status');
    }
  };

  const toggleBasketVisibility = async (basketId: string, isPrivate: boolean) => {
    try {
      const { error } = await supabase
        .from('baskets')
        .update({ 
          is_private: !isPrivate,
          public: isPrivate // public is opposite of private
        })
        .eq('id', basketId);

      if (error) throw error;
      toast.success(`Basket visibility updated`);
      fetchBaskets();
    } catch (error: any) {
      console.error('[ADMIN_BASKETS] Visibility update error:', error);
      toast.error('Failed to update basket visibility');
    }
  };

  const deleteBasket = async (basketId: string) => {
    try {
      const { error } = await supabase
        .from('baskets')
        .delete()
        .eq('id', basketId);

      if (error) throw error;
      toast.success('Basket deleted successfully');
      fetchBaskets();
    } catch (error: any) {
      console.error('[ADMIN_BASKETS] Delete error:', error);
      toast.error('Failed to delete basket');
    }
  };

  useEffect(() => {
    fetchBaskets();
  }, []);

  const filteredBaskets = baskets.filter(basket => {
    const matchesSearch = basket.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         basket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         basket.users.display_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || basket.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || basket.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalBaskets = baskets.length;
  const activeBaskets = baskets.filter(b => b.status === 'active').length;
  const totalGoalAmount = baskets.reduce((sum, basket) => sum + basket.goal_amount, 0);
  const totalCurrentAmount = baskets.reduce((sum, basket) => sum + basket.current_amount, 0);

  if (loading) {
    return <GlassCard className="p-6">Loading baskets...</GlassCard>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Package className="w-6 h-6" />
          <h1 className="text-2xl font-bold">Basket Management</h1>
        </div>
        <Badge variant="outline">
          {activeBaskets} active / {totalBaskets} total
        </Badge>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <GlassCard className="p-4">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-sm text-muted-foreground">Total Baskets</p>
              <p className="text-xl font-bold">{totalBaskets}</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard className="p-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-green-500" />
            <div>
              <p className="text-sm text-muted-foreground">Active Baskets</p>
              <p className="text-xl font-bold">{activeBaskets}</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard className="p-4">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-purple-500" />
            <div>
              <p className="text-sm text-muted-foreground">Total Goal</p>
              <p className="text-xl font-bold">{formatCurrency(totalGoalAmount)}</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard className="p-4">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-orange-500" />
            <div>
              <p className="text-sm text-muted-foreground">Total Raised</p>
              <p className="text-xl font-bold">{formatCurrency(totalCurrentAmount)}</p>
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
                placeholder="Search baskets by name, description, or creator..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="personal">Personal</SelectItem>
              <SelectItem value="education">Education</SelectItem>
              <SelectItem value="health">Health</SelectItem>
              <SelectItem value="community">Community</SelectItem>
              <SelectItem value="business">Business</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </GlassCard>

      {/* Baskets Table */}
      <GlassCard className="p-0 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Basket</TableHead>
              <TableHead>Creator</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Participants</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Visibility</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBaskets.map((basket) => (
              <TableRow key={basket.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{basket.name}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {basket.description}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="font-medium">{basket.users.display_name}</p>
                  <p className="text-xs text-muted-foreground">{basket.country}</p>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{basket.category}</Badge>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${Math.min((basket.current_amount / basket.goal_amount) * 100, 100)}%` }}
                        />
                      </div>
                      <span className="text-xs">
                        {Math.round((basket.current_amount / basket.goal_amount) * 100)}%
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatCurrency(basket.current_amount)} / {formatCurrency(basket.goal_amount)}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>{basket.participants_count}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={basket.status === 'active' ? 'default' : 'secondary'}>
                    {basket.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={basket.is_private ? 'secondary' : 'default'}>
                    {basket.is_private ? 'Private' : 'Public'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setSelectedBasket(basket)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>{selectedBasket?.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium">Creator</p>
                              <p className="text-sm text-muted-foreground">{selectedBasket?.users.display_name}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Country</p>
                              <p className="text-sm text-muted-foreground">{selectedBasket?.country}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Category</p>
                              <p className="text-sm text-muted-foreground">{selectedBasket?.category}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Created</p>
                              <p className="text-sm text-muted-foreground">
                                {selectedBasket && new Date(selectedBasket.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Description</p>
                            <p className="text-sm text-muted-foreground">{selectedBasket?.description}</p>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium">Goal Amount</p>
                              <p className="text-lg font-bold">{selectedBasket && formatCurrency(selectedBasket.goal_amount)}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium">Raised Amount</p>
                              <p className="text-lg font-bold">{selectedBasket && formatCurrency(selectedBasket.current_amount)}</p>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    <Select 
                      value={basket.status} 
                      onValueChange={(newStatus) => updateBasketStatus(basket.id, newStatus)}
                    >
                      <SelectTrigger className="w-24 h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="paused">Paused</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => toggleBasketVisibility(basket.id, basket.is_private)}
                    >
                      {basket.is_private ? 'Make Public' : 'Make Private'}
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Basket</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{basket.name}"? This action cannot be undone and will affect all participants.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => deleteBasket(basket.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </GlassCard>

      {filteredBaskets.length === 0 && !loading && (
        <GlassCard className="p-12 text-center">
          <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">No baskets found matching your criteria.</p>
        </GlassCard>
      )}
    </div>
  );
};

export default AdminBaskets; 