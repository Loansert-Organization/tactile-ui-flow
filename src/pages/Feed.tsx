
import React, { useState, useEffect } from 'react';
import { RefreshCw, Inbox, AlertCircle, QrCode } from 'lucide-react';
import { BasketCard } from '@/components/BasketCard';
import { EmptyState } from '@/components/EmptyState';
import { BasketCardSkeleton } from '@/components/ui/enhanced-skeleton';
import { GlassCard } from '@/components/ui/glass-card';
import { GradientButton } from '@/components/ui/gradient-button';
import { EnhancedButton } from '@/components/ui/enhanced-button';
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
    } finally {
      setRefreshing(false);
    }
  };

  const handleRetry = async () => {
    try {
      await retry(loadBaskets);
    } catch (err) {
      console.error('Retry failed:', err);
    }
  };

  const handleJoinSuccess = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 500);
  };

  const handleQRCodeScanned = (url: string) => {
    setShowScanner(false);

    const basketIdMatch = url.match(/\/basket\/([^/?]+)/);
    if (basketIdMatch) {
      const basketId = basketIdMatch[1];

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
      }
    };
    
    initializeBaskets();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-hero">
        <div className="container mx-auto px-4 py-6 space-y-6">
          {/* Skeleton for header */}
          <div className="text-center py-8 space-y-4 animate-fade-in">
            <div className="h-10 w-64 bg-white/20 rounded-xl shimmer mx-auto"></div>
            <div className="h-6 w-80 bg-white/15 rounded-lg shimmer mx-auto"></div>
          </div>

          {/* Skeleton for baskets */}
          <div className="grid gap-4 sm:gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-slide-up" style={{ animationDelay: `${i * 200}ms` }}>
                <BasketCardSkeleton />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-hero">
        <div className="container mx-auto px-4 py-6">
          <GlassCard variant="strong" size="lg" className="text-center animate-scale-in">
            <AlertCircle className="w-16 h-16 sm:w-20 sm:h-20 text-red-400 mx-auto mb-6" />
            <h3 className="text-xl sm:text-2xl font-bold gradient-text mb-4">Failed to load baskets</h3>
            <p className="text-base sm:text-lg text-white/80 mb-8 max-w-md mx-auto leading-relaxed">
              {error.message || 'Please check your connection and try again'}
            </p>
            <EnhancedButton 
              onClick={handleRetry} 
              variant="gradient" 
              size="lg"
              className="w-full sm:w-auto"
            >
              <RefreshCw className="w-5 h-5 mr-2" />
              Retry
            </EnhancedButton>
          </GlassCard>
        </div>
      </div>
    );
  }

  if (publicBaskets.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-hero">
        <div className="container mx-auto px-4 py-6">
          <EmptyState 
            title="No Public Baskets Available" 
            description="There are no public baskets available to join at the moment. Try scanning a QR code or check back later!" 
            actionLabel="Scan QR Code" 
            onAction={() => setShowScanner(true)} 
            icon={<QrCode className="w-12 h-12 sm:w-16 sm:h-16 text-purple-400" />} 
          />
        </div>
        <QRScannerOverlay 
          isOpen={showScanner} 
          onClose={() => setShowScanner(false)} 
          onQRCodeScanned={handleQRCodeScanned} 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div 
        className="container mx-auto px-4 py-6 space-y-6 sm:space-y-8" 
        onTouchStart={handleTouchStart} 
        onTouchEnd={handleTouchEnd}
      >
        {/* Pull to refresh indicator */}
        {refreshing && (
          <div className="flex items-center justify-center py-4 animate-fade-in">
            <GlassCard variant="subtle" className="flex items-center gap-3 px-6 py-3">
              <RefreshCw className="w-5 h-5 animate-spin text-white" />
              <span className="text-sm sm:text-base font-medium text-white">Refreshing...</span>
            </GlassCard>
          </div>
        )}

        {/* Enhanced hero header */}
        <div className="text-center py-8 sm:py-12 space-y-4 animate-slide-down">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 animate-float">
            Discover Public Baskets
          </h1>
          <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            Join community funding initiatives and make a difference together
          </p>
          
          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
            <EnhancedButton
              variant="glass"
              size="lg"
              onClick={() => setShowScanner(true)}
              className="w-full sm:w-auto"
            >
              <QrCode className="w-5 h-5 mr-2" />
              Scan QR Code
            </EnhancedButton>
            <EnhancedButton
              variant="gradient"
              size="lg"
              onClick={() => navigate('/baskets/new')}
              className="w-full sm:w-auto"
            >
              Create New Basket
            </EnhancedButton>
          </div>
        </div>

        {/* ARIA live region for announcements */}
        <div className="sr-only" aria-live="polite" id="feed-announcements" />

        {/* Enhanced baskets grid */}
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
          {publicBaskets.map((basket, index) => (
            <div 
              key={basket.id} 
              className="animate-slide-up will-change-transform" 
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <BasketCard 
                {...basket} 
                onJoinSuccess={handleJoinSuccess} 
                showOnHomeScreen={true} 
              />
            </div>
          ))}
        </div>

        {/* Enhanced completion message */}
        <div className="text-center py-12 animate-fade-in">
          <GlassCard variant="subtle" className="inline-block px-8 py-6">
            <div className="text-2xl mb-2">🎉</div>
            <p className="text-white/80 text-base sm:text-lg font-medium">
              You're all caught up!
            </p>
            <p className="text-white/60 text-sm sm:text-base mt-2">
              Check back later for new community baskets
            </p>
          </GlassCard>
        </div>
      </div>

      <QRScannerOverlay 
        isOpen={showScanner} 
        onClose={() => setShowScanner(false)} 
        onQRCodeScanned={handleQRCodeScanned} 
      />
    </div>
  );
};
