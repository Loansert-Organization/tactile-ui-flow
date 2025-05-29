
import React, { useState, useEffect } from 'react';
import { RefreshCw, Inbox, AlertCircle } from 'lucide-react';
import { BasketCard } from '@/components/BasketCard';
import { EmptyState } from '@/components/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import { GlassCard } from '@/components/ui/glass-card';
import { GradientButton } from '@/components/ui/gradient-button';
import { useSwipeGesture } from '@/hooks/useInteractions';

// Dummy data for baskets
const dummyBaskets = [
  {
    id: '1',
    name: 'Arsenal Season Tickets',
    description: 'Pooling together to get season tickets for the Emirates Stadium. Join us for every home game!',
    progress: 75,
    goal: 2000000,
    currentAmount: 1500000,
    participants: 12,
    isPrivate: false
  },
  {
    id: '2',
    name: 'Weekend Getaway Fund',
    description: 'Saving up for an amazing weekend trip to Lake Kivu. Beautiful views and great memories await!',
    progress: 45,
    goal: 500000,
    currentAmount: 225000,
    participants: 8,
    isPrivate: false
  },
  {
    id: '3',
    name: 'Private Investment Group',
    description: 'Exclusive investment opportunities for verified members only.',
    progress: 90,
    participants: 5,
    isPrivate: true
  },
  {
    id: '4',
    name: 'Community Garden Project',
    description: 'Building a sustainable community garden in Kimisagara. Growing together, thriving together.',
    progress: 30,
    goal: 800000,
    currentAmount: 240000,
    participants: 24,
    isPrivate: false
  },
  {
    id: '5',
    name: 'Tech Startup Fund',
    description: 'Supporting local tech innovation. Help us build the next big thing in fintech.',
    progress: 60,
    goal: 5000000,
    currentAmount: 3000000,
    participants: 35,
    isPrivate: false
  }
];

export const Feed = () => {
  const [baskets, setBaskets] = useState<typeof dummyBaskets>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const { handleTouchStart, handleTouchEnd } = useSwipeGesture(
    undefined,
    () => handleRefresh()
  );

  const loadBaskets = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setBaskets(dummyBaskets);
      setError(false);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    await loadBaskets();
    setRefreshing(false);
  };

  const handleRetry = () => {
    setLoading(true);
    setError(false);
    loadBaskets();
  };

  useEffect(() => {
    loadBaskets();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 p-4 pb-24">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <GlassCard key={i} className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <Skeleton variant="circle" className="w-12 h-12" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-2 w-full" />
              <Skeleton className="h-10 w-full" />
            </GlassCard>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 pb-24">
        <GlassCard className="p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Failed to load baskets</h3>
          <p className="text-gray-400 mb-4">Please check your connection and try again</p>
          <GradientButton onClick={handleRetry} variant="primary">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </GradientButton>
        </GlassCard>
      </div>
    );
  }

  if (baskets.length === 0) {
    return (
      <div className="p-4 pb-24">
        <EmptyState
          title="No Baskets Yet"
          description="Be the first to create a community basket and start building something amazing together!"
          actionLabel="Create Your First Basket"
          onAction={() => console.log('Navigate to create')}
          icon={<Inbox className="w-10 h-10 text-purple-400" />}
        />
      </div>
    );
  }

  return (
    <div 
      className="space-y-6 p-4 pb-24"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull to refresh indicator */}
      {refreshing && (
        <div className="flex items-center justify-center py-4">
          <div className="flex items-center gap-2 text-purple-400">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span className="text-sm">Refreshing...</span>
          </div>
        </div>
      )}

      {/* Feed header */}
      <div className="text-center py-4">
        <h2 className="text-2xl font-bold gradient-text mb-2">Public Baskets</h2>
        <p className="text-gray-400">Discover and join community funding initiatives</p>
      </div>

      {/* Baskets list */}
      <div className="space-y-4">
        {baskets.map((basket, index) => (
          <div 
            key={basket.id}
            className="animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <BasketCard {...basket} />
          </div>
        ))}
      </div>

      {/* Load more placeholder */}
      <div className="text-center py-8">
        <p className="text-gray-500 text-sm">You're up to date! 🎉</p>
      </div>
    </div>
  );
};
