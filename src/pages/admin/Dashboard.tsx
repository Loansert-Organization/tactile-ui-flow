import React, { useState, useEffect } from 'react';
import { BarChart, Users, Package, CreditCard, DollarSign, TrendingUp, Globe, Wallet, Activity, LineChart } from 'lucide-react';
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
  dailyContributions: { date: string; amount: number; count: number }[];
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
    recentActivity: [],
    dailyContributions: []
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

      // Calculate daily contributions for the last 7 days
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split('T')[0];
      }).reverse();

      const dailyContributions = last7Days.map(date => {
        const dayContributions = contributions.filter(c => 
          c.confirmed && c.created_at.startsWith(date)
        );
        return {
          date,
          amount: dayContributions.reduce((sum, c) => sum + c.amount_usd, 0),
          count: dayContributions.length
        };
      });

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
        recentActivity,
        dailyContributions
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

  const maxDailyAmount = Math.max(...stats.dailyContributions.map(d => d.amount), 1);

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Users</p>
              <p className="text-2xl font-bold">{stats.totalUsers}</p>
              <p className="text-xs text-muted-foreground">Registered members</p>
            </div>
          </div>
        </GlassCard>
        
        <GlassCard className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Baskets</p>
              <p className="text-2xl font-bold">{stats.totalBaskets}</p>
              <p className="text-xs text-muted-foreground">{stats.activeBaskets} active</p>
            </div>
          </div>
        </GlassCard>
        
        <GlassCard className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Contributions</p>
              <p className="text-2xl font-bold">{stats.totalContributions}</p>
              <p className="text-xs text-muted-foreground">{stats.confirmedContributions} confirmed</p>
            </div>
          </div>
        </GlassCard>
        
        <GlassCard className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Volume</p>
              <p className="text-2xl font-bold">{formatCurrency(stats.totalAmount)}</p>
              <p className="text-xs text-muted-foreground">USD transacted</p>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Daily Contributions Chart */}
        <GlassCard className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <LineChart className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold">Daily Contributions (Last 7 Days)</h3>
          </div>
          <div className="space-y-3">
            {stats.dailyContributions.map((day, index) => (
              <div key={day.date} className="flex items-center gap-4">
                <div className="w-16 text-xs text-muted-foreground">
                  {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
                <div className="flex-1 bg-muted rounded-full h-4 relative">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full transition-all duration-300" 
                    style={{ 
                      width: `${maxDailyAmount > 0 ? (day.amount / maxDailyAmount) * 100 : 0}%`,
                      minWidth: day.amount > 0 ? '4px' : '0px'
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                    {day.count > 0 && `${day.count}`}
                  </div>
                </div>
                <div className="w-20 text-xs text-right font-medium">
                  {formatCurrency(day.amount)}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total (7 days)</span>
              <span className="font-medium">
                {formatCurrency(stats.dailyContributions.reduce((sum, day) => sum + day.amount, 0))}
              </span>
            </div>
          </div>
        </GlassCard>

        {/* System Health */}
        <GlassCard className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-green-500" />
            <h3 className="text-lg font-semibold">System Health</h3>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Basket Activity Rate</span>
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
                className="h-2"
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
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">Wallet Coverage</span>
                <span className="text-sm font-medium">
                  {formatCurrency(stats.totalWalletBalance)}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-3">
                <div className="p-2 bg-green-500/10 rounded-lg text-center">
                  <div className="flex items-center justify-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-green-600 font-medium">Online</span>
                  </div>
                </div>
                <div className="p-2 bg-blue-500/10 rounded-lg text-center">
                  <span className="text-xs text-blue-600 font-medium">{stats.totalCountries} Countries</span>
                </div>
                <div className="p-2 bg-purple-500/10 rounded-lg text-center">
                  <span className="text-xs text-purple-600 font-medium">Stable</span>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Recent Activity */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-5 h-5 text-orange-500" />
          <h3 className="text-lg font-semibold">Recent Activity</h3>
        </div>
        <div className="space-y-3">
          {stats.recentActivity.length > 0 ? (
            stats.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
                {activity.type === 'contribution' ? (
                  <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-purple-500" />
                  </div>
                ) : (
                  <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <Package className="w-4 h-4 text-green-500" />
                  </div>
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

      {/* Quick Actions */}
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="p-4 text-center border border-border rounded-lg hover:bg-muted/30 cursor-pointer transition-colors group">
            <Users className="w-6 h-6 mx-auto mb-2 text-blue-500 group-hover:scale-110 transition-transform" />
            <p className="text-sm font-medium">Manage Users</p>
            <p className="text-xs text-muted-foreground">User admin panel</p>
          </button>
          <button className="p-4 text-center border border-border rounded-lg hover:bg-muted/30 cursor-pointer transition-colors group">
            <Package className="w-6 h-6 mx-auto mb-2 text-green-500 group-hover:scale-110 transition-transform" />
            <p className="text-sm font-medium">Review Baskets</p>
            <p className="text-xs text-muted-foreground">Basket management</p>
          </button>
          <button className="p-4 text-center border border-border rounded-lg hover:bg-muted/30 cursor-pointer transition-colors group">
            <CreditCard className="w-6 h-6 mx-auto mb-2 text-purple-500 group-hover:scale-110 transition-transform" />
            <p className="text-sm font-medium">Process Payments</p>
            <p className="text-xs text-muted-foreground">Transaction review</p>
          </button>
          <button className="p-4 text-center border border-border rounded-lg hover:bg-muted/30 cursor-pointer transition-colors group">
            <Globe className="w-6 h-6 mx-auto mb-2 text-cyan-500 group-hover:scale-110 transition-transform" />
            <p className="text-sm font-medium">Country Settings</p>
            <p className="text-xs text-muted-foreground">Regional config</p>
          </button>
        </div>
      </GlassCard>
    </div>
  );
};

export default Dashboard; 