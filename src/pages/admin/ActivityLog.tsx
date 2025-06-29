import React, { useState, useEffect } from 'react';
import { Activity, Search, Calendar, User, Shield, Package, CreditCard, Clock, Filter, FileText } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { formatCurrency } from '@/lib/formatters';

interface ActivityLogEntry {
  id: string;
  timestamp: string;
  admin_id: string;
  action: string;
  target_table: string;
  record_id: string;
  details?: any;
  ip_address?: string;
  user_agent?: string;
}

interface SystemActivity {
  id: string;
  type: 'user_signup' | 'basket_created' | 'contribution_made' | 'basket_completed' | 'admin_action';
  timestamp: string;
  user_id?: string;
  description: string;
  metadata?: any;
  amount?: number;
  user_name?: string;
  basket_name?: string;
}

const AdminActivityLog: React.FC = () => {
  const [activities, setActivities] = useState<SystemActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activityFilter, setActivityFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('today');

  const fetchActivities = async () => {
    try {
      setLoading(true);
      
      // Since there's no activity_log table, we'll create a synthetic activity log
      // from various sources like baskets, contributions, and users
      const [
        basketsResponse,
        contributionsResponse,
        usersResponse
      ] = await Promise.all([
        supabase.from('baskets').select('id, name, created_at, creator_id, users!inner(display_name)').order('created_at', { ascending: false }).limit(50),
        supabase.from('contributions').select('id, amount_usd, created_at, confirmed, basket_id, user_id, users!inner(display_name), baskets!inner(name)').order('created_at', { ascending: false }).limit(50),
        supabase.from('users').select('id, display_name, created_at, role').order('created_at', { ascending: false }).limit(30)
      ]);

      if (basketsResponse.error) throw basketsResponse.error;
      if (contributionsResponse.error) throw contributionsResponse.error;
      if (usersResponse.error) throw usersResponse.error;

      const baskets = basketsResponse.data || [];
      const contributions = contributionsResponse.data || [];
      const users = usersResponse.data || [];

      // Create synthetic activity entries
      const syntheticActivities: SystemActivity[] = [
        // User signups
        ...users.map(user => ({
          id: `user_${user.id}`,
          type: 'user_signup' as const,
          timestamp: user.created_at,
          user_id: user.id,
          user_name: user.display_name,
          description: `${user.display_name} joined the platform`,
          metadata: { role: user.role }
        })),
        
        // Basket creations
        ...baskets.map(basket => ({
          id: `basket_${basket.id}`,
          type: 'basket_created' as const,
          timestamp: basket.created_at,
          user_id: basket.creator_id,
          user_name: basket.users.display_name,
          basket_name: basket.name,
          description: `${basket.users.display_name} created basket "${basket.name}"`,
          metadata: { basket_id: basket.id }
        })),
        
        // Contributions
        ...contributions.map(contribution => ({
          id: `contribution_${contribution.id}`,
          type: 'contribution_made' as const,
          timestamp: contribution.created_at,
          user_id: contribution.user_id,
          user_name: contribution.users.display_name,
          basket_name: contribution.baskets.name,
          amount: contribution.amount_usd,
          description: `${contribution.users.display_name} contributed ${formatCurrency(contribution.amount_usd)} to "${contribution.baskets.name}"${contribution.confirmed ? '' : ' (pending)'}`,
          metadata: { 
            contribution_id: contribution.id, 
            basket_id: contribution.basket_id,
            confirmed: contribution.confirmed
          }
        }))
      ];

      // Sort by timestamp descending
      syntheticActivities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      setActivities(syntheticActivities);
    } catch (error: any) {
      console.error('[ADMIN_ACTIVITY_LOG] Fetch error:', error);
      toast.error('Failed to load activity log');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const getFilteredActivities = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const thisWeek = new Date(today);
    thisWeek.setDate(thisWeek.getDate() - 7);

    return activities.filter(activity => {
      // Text search
      const matchesSearch = !searchTerm || 
        activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (activity.user_name && activity.user_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (activity.basket_name && activity.basket_name.toLowerCase().includes(searchTerm.toLowerCase()));

      // Activity type filter
      const matchesType = activityFilter === 'all' || activity.type === activityFilter;

      // Date filter
      const activityDate = new Date(activity.timestamp);
      let matchesDate = true;
      switch (dateFilter) {
        case 'today':
          matchesDate = activityDate >= today;
          break;
        case 'yesterday':
          matchesDate = activityDate >= yesterday && activityDate < today;
          break;
        case 'week':
          matchesDate = activityDate >= thisWeek;
          break;
        case 'all':
        default:
          matchesDate = true;
      }

      return matchesSearch && matchesType && matchesDate;
    });
  };

  const filteredActivities = getFilteredActivities();

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_signup':
        return <User className="w-4 h-4 text-blue-500" />;
      case 'basket_created':
        return <Package className="w-4 h-4 text-green-500" />;
      case 'contribution_made':
        return <CreditCard className="w-4 h-4 text-purple-500" />;
      case 'basket_completed':
        return <Shield className="w-4 h-4 text-orange-500" />;
      case 'admin_action':
        return <Shield className="w-4 h-4 text-red-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  const getActivityBadgeColor = (type: string) => {
    switch (type) {
      case 'user_signup':
        return 'bg-blue-500/10 text-blue-600';
      case 'basket_created':
        return 'bg-green-500/10 text-green-600';
      case 'contribution_made':
        return 'bg-purple-500/10 text-purple-600';
      case 'basket_completed':
        return 'bg-orange-500/10 text-orange-600';
      case 'admin_action':
        return 'bg-red-500/10 text-red-600';
      default:
        return 'bg-gray-500/10 text-gray-600';
    }
  };

  const activityStats = {
    today: activities.filter(a => new Date(a.timestamp).toDateString() === new Date().toDateString()).length,
    thisWeek: activities.filter(a => {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return new Date(a.timestamp) >= weekAgo;
    }).length,
    total: activities.length
  };

  if (loading) {
    return <GlassCard className="p-6">Loading activity log...</GlassCard>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-6 h-6" />
          <h1 className="text-2xl font-bold">Activity Log</h1>
        </div>
        <Badge variant="outline">
          {filteredActivities.length} entries
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassCard className="p-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-sm text-muted-foreground">Today</p>
              <p className="text-xl font-bold">{activityStats.today}</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard className="p-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-green-500" />
            <div>
              <p className="text-sm text-muted-foreground">This Week</p>
              <p className="text-xl font-bold">{activityStats.thisWeek}</p>
            </div>
          </div>
        </GlassCard>
        <GlassCard className="p-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-500" />
            <div>
              <p className="text-sm text-muted-foreground">Total Entries</p>
              <p className="text-xl font-bold">{activityStats.total}</p>
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
                placeholder="Search by user, action, or basket name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={activityFilter} onValueChange={setActivityFilter}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Activities</SelectItem>
              <SelectItem value="user_signup">User Signups</SelectItem>
              <SelectItem value="basket_created">Basket Created</SelectItem>
              <SelectItem value="contribution_made">Contributions</SelectItem>
              <SelectItem value="basket_completed">Basket Completed</SelectItem>
              <SelectItem value="admin_action">Admin Actions</SelectItem>
            </SelectContent>
          </Select>
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </GlassCard>

      {/* Activity Log Table */}
      <GlassCard className="p-0 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Activity</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredActivities.map((activity) => (
              <TableRow key={activity.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{activity.description}</p>
                      {activity.amount && (
                        <p className="text-xs text-muted-foreground">
                          Amount: {formatCurrency(activity.amount)}
                        </p>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{activity.user_name || 'System'}</p>
                    {activity.basket_name && (
                      <p className="text-xs text-muted-foreground">Basket: {activity.basket_name}</p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getActivityBadgeColor(activity.type)}`}>
                    {activity.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="text-xs text-muted-foreground max-w-xs">
                    {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                      <div className="space-y-1">
                        {Object.entries(activity.metadata).map(([key, value]) => (
                          <div key={key}>
                            <span className="font-medium">{key}:</span> {String(value)}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-muted-foreground" />
                    <div>
                      <span className="text-sm">
                        {new Date(activity.timestamp).toLocaleDateString()}
                      </span>
                      <p className="text-xs text-muted-foreground">
                        {new Date(activity.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </GlassCard>

      {filteredActivities.length === 0 && !loading && (
        <GlassCard className="p-12 text-center">
          <Activity className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">No activities found matching your criteria.</p>
        </GlassCard>
      )}
    </div>
  );
};

export default AdminActivityLog;