import React, { useEffect } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import { BasketCard } from '@/components/BasketCard';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { Plus, QrCode, Smartphone, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const Feed = () => {
  const { user, ensureAnonymousAuth } = useAuthContext();

  // Ensure anonymous auth when accessing main app
  useEffect(() => {
    if (!user) {
      ensureAnonymousAuth();
    }
  }, [user, ensureAnonymousAuth]);

  const { data: baskets = [], isLoading } = useQuery({
    queryKey: ['baskets', 'public'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('baskets')
        .select('*')
        .eq('is_private', false)
        .order('created_at', { ascending: false })
        .limit(20);
      
      if (error) throw error;
      return data || [];
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-center items-center py-16">
          <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 pb-24">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome to IKANISA
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Your gateway to savings and mobile money solutions
          </p>
        </div>

        {/* Featured Tools Section */}
        <div className="grid gap-4 sm:grid-cols-2 mb-8">
          {/* Easy Momo Feature Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <GlassCard className="p-6 hover:scale-105 transition-transform cursor-pointer">
              <Link to="/easy-momo" className="block">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <QrCode className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Easy Momo
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Mobile Money Made Simple
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <Smartphone className="w-4 h-4" />
                  <span>Scan • Pay • Request</span>
                  <Zap className="w-4 h-4 ml-2" />
                  <span>Instant</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Generate QR codes for payments, scan to pay others, and manage mobile money transactions with ease.
                </p>
              </Link>
            </GlassCard>
          </motion.div>

          {/* Savings Baskets Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard className="p-6 hover:scale-105 transition-transform cursor-pointer">
              <Link to="/baskets/new" className="block">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-orange-500 rounded-xl flex items-center justify-center">
                    <Plus className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      Savings Baskets
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Collaborative Goal Setting
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <span>👥 Community</span>
                  <span>🎯 Goals</span>
                  <span>💰 Savings</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Create or join savings goals with your community. Track progress together and achieve more.
                </p>
              </Link>
            </GlassCard>
          </motion.div>
        </div>
      </motion.div>

      {/* Baskets Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-6"
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Discover Baskets
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Join savings goals with your community
            </p>
          </div>
          
          <Link to="/baskets/mine">
            <Button variant="outline" size="sm">
              My Baskets
            </Button>
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {baskets.map((basket, index) => (
            <motion.div
              key={basket.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + (index * 0.1) }}
            >
              <BasketCard
                id={basket.id}
                title={basket.title}
                description={basket.description}
                goalAmount={Number(basket.goal_amount)}
                currentAmount={Number(basket.current_amount)}
                participantsCount={basket.participants_count}
                daysLeft={basket.duration_days}
                category={basket.category}
                currency={basket.currency}
                country={basket.country}
              />
            </motion.div>
          ))}
        </div>

        {baskets.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center py-16"
          >
            <div className="text-6xl mb-4">🏆</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No baskets yet
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Be the first to create a savings basket
            </p>
            <Link to="/baskets/new">
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Create First Basket
              </Button>
            </Link>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
