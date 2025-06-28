
import React, { useState, useEffect } from 'react';
import { RefreshCw, Inbox, AlertCircle, QrCode } from 'lucide-react';
import { BasketCard } from '@/components/BasketCard';
import { EmptyState } from '@/components/EmptyState';
import { BasketCardSkeleton } from '@/components/ui/enhanced-skeleton';
import { GlassCard } from '@/components/ui/glass-card';
import { GradientButton } from '@/components/ui/gradient-button';
import { useSwipeGesture } from '@/hooks/useInteractions';
import { useBaskets } from '@/contexts/BasketContext';
import { useLoadingState } from '@/hooks/useLoadingState';
import { useRenderPerformance } from '@/hooks/usePerformanceMonitor';
import { QRScannerOverlay } from '@/components/QRScannerOverlay';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

export const Feed = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const navigate = useNavigate();
  const {
    isLoading,
    error,
    executeWithLoading,
    retry
  } = useLoadingState({
    minimumDuration: 800
  });
  const {
    getPublicBaskets
  } = useBaskets();
  useRenderPerformance('Feed');
  const {
    handleTouchStart,
    handleTouchEnd
  } = useSwipeGesture(undefined, () => handleRefresh());

  // Get all public baskets (admin-created only)
  const publicBaskets = getPublicBaskets();
  
  const loadBaskets = async () => {
    try {
      // Simulate API call with realistic timing
      await new Promise(resolve => setTimeout(resolve, 1200));

      // Remove the simulated error that was causing issues
      // The error simulation is not needed and was causing unhandled promise rejections
      console.log('Baskets loaded successfully');
    } catch (err) {
      console.error('Failed to load baskets:', err);
      throw err;
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await executeWithLoading(loadBaskets);
    } catch (err) {
      console.error('Refresh failed:', err);
      // Error is already handled by useLoadingState
    } finally {
      setRefreshing(false);
    }
  };

  const handleRetry = async () => {
    try {
      await retry(loadBaskets);
    } catch (err) {
      console.error('Retry failed:', err);
      // Error is already handled by useLoadingState
    }
  };

  const handleJoinSuccess = () => {
    // Trigger a refresh animation
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 500);
  };

  const handleQRCodeScanned = (url: string) => {
    setShowScanner(false);

    // Extract basket ID from URL
    const basketIdMatch = url.match(/\/basket\/([^/?]+)/);
    if (basketIdMatch) {
      const basketId = basketIdMatch[1];

      // Simulate joining the basket
      toast({
        title: "Basket Found!",
        description: "You've successfully joined this basket"
      });
      navigate(`/basket/${basketId}`);
    } else {
      toast({
        title: "Invalid QR Code",
        description: "This QR code doesn't contain a valid basket link",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    const initializeBaskets = async () => {
      try {
        await executeWithLoading(loadBaskets);
      } catch (err) {
        console.error('Initial basket load failed:', err);
        // Error is handled by useLoadingState
      }
    };
    
    initializeBaskets();
  }, []);

  if (isLoading) {
    return <div className="space-y-6 p-4">
        {/* Skeleton for header */}
        <div className="text-center py-4 space-y-2">
          <div className="h-8 w-48 bg-gray-700/50 rounded-lg shimmer mx-auto"></div>
          <div className="h-4 w-64 bg-gray-700/50 rounded-lg shimmer mx-auto"></div>
        </div>

        {/* Skeleton for baskets */}
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => <BasketCardSkeleton key={i} />)}
        </div>
      </div>;
  }

  if (error) {
    return <div className="p-4">
        <GlassCard className="p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Failed to load baskets</h3>
          <p className="text-gray-400 mb-4">
            {error.message || 'Please check your connection and try again'}
          </p>
          <GradientButton onClick={handleRetry} variant="primary">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </GradientButton>
        </GlassCard>
      </div>;
  }

  if (publicBaskets.length === 0) {
    return <>
        <div className="p-4">
          <EmptyState title="No Public Baskets Available" description="There are no public baskets available to join at the moment. Try scanning a QR code or check back later!" actionLabel="Scan QR Code" onAction={() => setShowScanner(true)} icon={<QrCode className="w-10 h-10 text-purple-400" />} />
        </div>
        <QRScannerOverlay isOpen={showScanner} onClose={() => setShowScanner(false)} onQRCodeScanned={handleQRCodeScanned} />
      </>;
  }

  return <>
      <div className="space-y-6 p-4" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        {/* Pull to refresh indicator */}
        {refreshing && <div className="flex items-center justify-center py-4">
            <div className="flex items-center gap-2 text-purple-400">
              <RefreshCw className="w-5 h-5 animate-spin" />
              <span className="text-sm">Refreshing...</span>
            </div>
          </div>}

        {/* Feed header */}
        <div className="text-center py-4">
          <h2 className="text-2xl font-bold gradient-text mb-2">Discover Public Baskets</h2>
          <p className="text-gray-400 mb-4">Join community funding initiatives</p>
        </div>

        {/* ARIA live region for announcements */}
        <div className="sr-only" aria-live="polite" id="feed-announcements" />

        {/* Baskets list */}
        <div className="space-y-4">
          {publicBaskets.map((basket, index) => <div key={basket.id} className="animate-slide-up" style={{
          animationDelay: `${index * 100}ms`
        }}>
              <BasketCard {...basket} onJoinSuccess={handleJoinSuccess} showOnHomeScreen={true} />
            </div>)}
        </div>

        {/* Load more placeholder */}
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">You're up to date! 🎉</p>
        </div>
      </div>

      <QRScannerOverlay isOpen={showScanner} onClose={() => setShowScanner(false)} onQRCodeScanned={handleQRCodeScanned} />
    </>;
};
