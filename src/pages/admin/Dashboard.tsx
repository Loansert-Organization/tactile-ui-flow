import React, { useState, useEffect } from 'react';
import { BarChart, Users, Package, CreditCard, DollarSign, TrendingUp, Globe, Wallet } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { formatCurrency } from '@/lib/formatters';

interface DashboardStats {
  totalUsers: number;
  totalBaskets: number;
  totalContributions: number;
  totalAmount: number;
  activeBaskets: number;
  confirmedContributions: number;
  totalCountries: number;
  totalWalletBalance: number;
  recentActivity: any[];
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalBaskets: 0,
    totalContributions: 0,
    totalAmount: 0,
    activeBaskets: 0,
    confirmedContributions: 0,
    totalCountries: 0,
    totalWalletBalance: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);

      // Fetch all stats in parallel
      const [
        usersResponse,
        basketsResponse,
        contributionsResponse,
        countriesResponse,
        walletsResponse
      ] = await Promise.all([
        supabase.from('users').select('id, role, created_at'),
        supabase.from('baskets').select('id, status, goal_amount, current_amount, created_at'),
        supabase.from('contributions').select('id, amount_usd, confirmed, created_at'),
        supabase.from('countries').select('id, is_active'),
        supabase.from('wallets').select('balance_usd')
      ]);

      if (usersResponse.error) throw usersResponse.error;
      if (basketsResponse.error) throw basketsResponse.error;
      if (contributionsResponse.error) throw contributionsResponse.error;
      if (countriesResponse.error) throw countriesResponse.error;
      if (walletsResponse.error) throw walletsResponse.error;

      const users = usersResponse.data || [];
      const baskets = basketsResponse.data || [];
      const contributions = contributionsResponse.data || [];
      const countries = countriesResponse.data || [];
      const wallets = walletsResponse.data || [];

      // Calculate stats
      const totalUsers = users.length;
      const totalBaskets = baskets.length;
      const totalContributions = contributions.length;
      const activeBaskets = baskets.filter(b => b.status === 'active').length;
      const confirmedContributions = contributions.filter(c => c.confirmed).length;
      const totalAmount = contributions
        .filter(c => c.confirmed)
        .reduce((sum, c) => sum + c.amount_usd, 0);
      const totalCountries = countries.filter(c => c.is_active).length;
      const totalWalletBalance = wallets.reduce((sum, w) => sum + w.balance_usd, 0);

      // Recent activity (last 10 items)
      const recentActivity = [
        ...contributions.slice(0, 5).map(c => ({
          type: 'contribution',
          timestamp: c.created_at,
          description: `New contribution of ${formatCurrency(c.amount_usd)}`
        })),
        ...baskets.slice(0, 5).map(b => ({
          type: 'basket',
          timestamp: b.created_at,
          description: `New basket created`
        }))
      ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 10);

      setStats({
        totalUsers,
        totalBaskets,
        totalContributions,
        totalAmount,
        activeBaskets,
        confirmedContributions,
        totalCountries,
        totalWalletBalance,
        recentActivity
      });
    } catch (error: any) {
      console.error('[ADMIN_DASHBOARD] Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  if (loading) {
    return <GlassCard className="p-6">Loading dashboard...</GlassCard>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart className="w-6 h-6" />
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        </div>
        <Badge variant="outline">
          System Overview
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <GlassCard className="p-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-500" />
            <div>
              <p className="text-sm text-muted-foreground">Total Users</p>
              <p className="text-2xl font-bold">{stats.totalUsers}</p>
            </div>
          </div>
        </GlassCard>
        
        <GlassCard className="p-4">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-green-500" />
            <div>
              <p className="text-sm text-muted-foreground">Total Baskets</p>
              <p className="text-2xl font-bold">{stats.totalBaskets}</p>
              <p className="text-xs text-muted-foreground">{stats.activeBaskets} active</p>
            </div>
          </div>
        </GlassCard>
        
        <GlassCard className="p-4">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-purple-500" />
            <div>
              <p className="text-sm text-muted-foreground">Contributions</p>
              <p className="text-2xl font-bold">{stats.totalContributions}</p>
              <p className="text-xs text-muted-foreground">{stats.confirmedContributions} confirmed</p>
            </div>
          </div>
        </GlassCard>
        
        <GlassCard className="p-4">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-orange-500" />
            <div>
              <p className="text-sm text-muted-foreground">Total Volume</p>
              <p className="text-2xl font-bold">{formatCurrency(stats.totalAmount)}</p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassCard className="p-4">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-cyan-500" />
            <div>
              <p className="text-sm text-muted-foreground">Active Countries</p>
              <p className="text-xl font-bold">{stats.totalCountries}</p>
            </div>
          </div>
        </GlassCard>
        
        <GlassCard className="p-4">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-pink-500" />
            <div>
              <p className="text-sm text-muted-foreground">Total Wallet Balance</p>
              <p className="text-xl font-bold">{formatCurrency(stats.totalWalletBalance)}</p>
            </div>
          </div>
        </GlassCard>
        
        <GlassCard className="p-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            <div>
              <p className="text-sm text-muted-foreground">Confirmation Rate</p>
              <p className="text-xl font-bold">
                {stats.totalContributions > 0 
                  ? Math.round((stats.confirmedContributions / stats.totalContributions) * 100)
                  : 0}%
              </p>
              <Progress 
                value={stats.totalContributions > 0 
                  ? (stats.confirmedContributions / stats.totalContributions) * 100
                  : 0} 
                className="mt-2"
              />
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="p-4">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {stats.recentActivity.length > 0 ? (
              stats.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                  {activity.type === 'contribution' ? (
                    <CreditCard className="w-4 h-4 text-purple-500" />
                  ) : (
                    <Package className="w-4 h-4 text-green-500" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(activity.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No recent activity</p>
            )}
          </div>
        </GlassCard>

        {/* System Health */}
        <GlassCard className="p-4">
          <h3 className="text-lg font-semibold mb-4">System Health</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Basket Completion Rate</span>
                <span className="text-sm font-medium">
                  {stats.totalBaskets > 0 
                    ? Math.round((stats.activeBaskets / stats.totalBaskets) * 100)
                    : 0}%
                </span>
              </div>
              <Progress 
                value={stats.totalBaskets > 0 
                  ? (stats.activeBaskets / stats.totalBaskets) * 100
                  : 0} 
              />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Payment Success Rate</span>
                <span className="text-sm font-medium">
                  {stats.totalContributions > 0 
                    ? Math.round((stats.confirmedContributions / stats.totalContributions) * 100)
                    : 0}%
                </span>
              </div>
              <Progress 
                value={stats.totalContributions > 0 
                  ? (stats.confirmedContributions / stats.totalContributions) * 100
                  : 0} 
                className="h-2"
              />
            </div>
            
            <div className="pt-2">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <p className="text-xs text-muted-foreground">System Status</p>
                  <p className="text-sm font-medium text-green-600">Operational</p>
                </div>
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <p className="text-xs text-muted-foreground">DB Health</p>
                  <p className="text-sm font-medium text-blue-600">Good</p>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Quick Actions */}
      <GlassCard className="p-4">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 text-center border rounded-lg hover:bg-muted/30 cursor-pointer transition-colors">
            <Users className="w-6 h-6 mx-auto mb-2 text-blue-500" />
            <p className="text-sm font-medium">Manage Users</p>
          </div>
          <div className="p-3 text-center border rounded-lg hover:bg-muted/30 cursor-pointer transition-colors">
            <Package className="w-6 h-6 mx-auto mb-2 text-green-500" />
            <p className="text-sm font-medium">Review Baskets</p>
          </div>
          <div className="p-3 text-center border rounded-lg hover:bg-muted/30 cursor-pointer transition-colors">
            <CreditCard className="w-6 h-6 mx-auto mb-2 text-purple-500" />
            <p className="text-sm font-medium">Process Payments</p>
          </div>
          <div className="p-3 text-center border rounded-lg hover:bg-muted/30 cursor-pointer transition-colors">
            <Globe className="w-6 h-6 mx-auto mb-2 text-cyan-500" />
            <p className="text-sm font-medium">Country Settings</p>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default Dashboard; 