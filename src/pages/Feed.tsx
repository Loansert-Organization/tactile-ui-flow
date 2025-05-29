
import React, { useState, useEffect } from 'react';
import { RefreshCw, Inbox, AlertCircle } from 'lucide-react';
import { BasketCard } from '@/components/BasketCard';
import { EmptyState } from '@/components/EmptyState';
import { Skeleton } from '@/components/ui/skeleton';
import { GlassCard } from '@/components/ui/glass-card';
import { GradientButton } from '@/components/ui/gradient-button';
import { useSwipeGesture } from '@/hooks/useInteractions';
import { useBaskets } from '@/contexts/BasketContext';
import { useMyBasketsContext } from '@/contexts/MyBasketsContext';

export const Feed = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { getNonMemberBaskets } = useBaskets();
  const { myBaskets } = useMyBasketsContext();

  const { handleTouchStart, handleTouchEnd } = useSwipeGesture(
    undefined,
    () => handleRefresh()
  );

  // Filter out baskets that user has already joined
  const availableBaskets = getNonMemberBaskets().filter(
    basket => !myBaskets.some(myBasket => myBasket.id === basket.id)
  );

  const loadBaskets = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
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

  const handleJoinSuccess = () => {
    // Trigger a refresh animation
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 500);
  };

  useEffect(() => {
    loadBaskets();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 p-4">
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
      <div className="p-4">
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

  if (availableBaskets.length === 0) {
    return (
      <div className="p-4">
        <EmptyState
          title="No Public Baskets"
          description="There are no public baskets available to join at the moment. Check back later!"
          actionLabel="Refresh"
          onAction={handleRefresh}
          icon={<Inbox className="w-10 h-10 text-purple-400" />}
        />
      </div>
    );
  }

  return (
    <div 
      className="space-y-6 p-4"
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
        <h2 className="text-2xl font-bold gradient-text mb-2">Discover Baskets</h2>
        <p className="text-gray-400">Join community funding initiatives</p>
      </div>

      {/* ARIA live region for announcements */}
      <div className="sr-only" aria-live="polite" id="feed-announcements" />

      {/* Baskets list */}
      <div className="space-y-4">
        {availableBaskets.map((basket, index) => (
          <div 
            key={basket.id}
            className="animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <BasketCard {...basket} onJoinSuccess={handleJoinSuccess} />
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
