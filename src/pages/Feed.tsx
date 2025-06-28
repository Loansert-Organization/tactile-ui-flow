
import React, { useEffect } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import { BasketCard } from '@/components/BasketCard';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-6"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Discover Baskets
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Join savings goals with your community
          </p>
        </div>
        
        <Link to="/baskets/new">
          <Button size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            Create
          </Button>
        </Link>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {baskets.map((basket, index) => (
          <motion.div
            key={basket.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
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
    </div>
  );
};
