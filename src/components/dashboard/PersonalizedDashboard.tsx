
import React, { useState, useEffect } from 'react';
import { User, Target, TrendingUp, Calendar, Gift, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { GlassCard } from '@/components/ui/glass-card';
import { ProgressMilestone } from '@/components/gamification/ProgressMilestone';
import { BadgeSystem, Badge } from '@/components/gamification/BadgeSystem';
import { StreakCounter } from '@/components/gamification/StreakCounter';
import { OfflineIndicator } from '@/components/offline/OfflineIndicator';
import { useOfflineQueue } from '@/hooks/useOfflineQueue';
import { formatCurrency } from '@/lib/formatters';

interface DashboardStats {
  totalContributed: number;
  activeBaskets: number;
  goalProgress: number;
  currentStreak: number;
  longestStreak: number;
  monthlyTarget: number;
  monthlyProgress: number;
}

interface PersonalizedDashboardProps {
  userName: string;
  stats: DashboardStats;
  badges: Badge[];
  onQuickAction?: (action: string) => void;
}

export const PersonalizedDashboard: React.FC<PersonalizedDashboardProps> = ({
  userName,
  stats,
  badges,
  onQuickAction
}) => {
  const { queuedActions, processQueue } = useOfflineQueue();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  const quickActions = [
    { id: 'contribute', label: 'Quick Contribute', icon: Gift },
    { id: 'create', label: 'New Basket', icon: Target },
    { id: 'invite', label: 'Invite Friends', icon: Users }
  ];

  return (
    <div className="space-y-6">
      {/* Offline Indicator */}
      <OfflineIndicator 
        pendingActions={queuedActions.length}
        onRetry={processQueue}
      />

      {/* Personalized Welcome */}
      <motion.div
        className="text-center py-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold gradient-text mb-2">
          {greeting}, {userName}! 👋
        </h1>
        <p className="text-gray-400">
          You've contributed {formatCurrency(stats.totalContributed)} this month
        </p>
      </motion.div>

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <GlassCard className="p-4 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-purple-pink flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold gradient-text">
              {stats.activeBaskets}
            </div>
            <div className="text-xs text-gray-400">Active Baskets</div>
          </GlassCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <GlassCard className="p-4 text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-teal-blue flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold gradient-text">
              {stats.goalProgress}%
            </div>
            <div className="text-xs text-gray-400">Goal Progress</div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Monthly Progress */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">This Month</h3>
            <div className="text-sm text-gray-400">
              {formatCurrency(stats.monthlyProgress)} / {formatCurrency(stats.monthlyTarget)}
            </div>
          </div>
          
          <ProgressMilestone
            currentProgress={stats.monthlyProgress}
            goal={stats.monthlyTarget}
            showCelebration={true}
          />
        </GlassCard>
      </motion.div>

      {/* Streak Counter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
      >
        <StreakCounter
          currentStreak={stats.currentStreak}
          longestStreak={stats.longestStreak}
          streakType="daily"
          lastContributionDate={new Date(Date.now() - 86400000)}
        />
      </motion.div>

      {/* Badge System */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
      >
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold mb-4">Your Achievements</h3>
          <BadgeSystem badges={badges} layout="grid" size="md" />
        </GlassCard>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        className="grid grid-cols-3 gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.4 }}
      >
        {quickActions.map((action, index) => (
          <motion.button
            key={action.id}
            onClick={() => onQuickAction?.(action.id)}
            className="glass p-4 rounded-lg hover:bg-white/10 transition-all duration-300 text-center group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 + index * 0.1, duration: 0.3 }}
          >
            <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-gradient-purple-pink/20 flex items-center justify-center group-hover:bg-gradient-purple-pink/30 transition-colors">
              <action.icon className="w-5 h-5 text-purple-400" />
            </div>
            <div className="text-xs font-medium">{action.label}</div>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
};
