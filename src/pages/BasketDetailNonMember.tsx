
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Target, Calendar, Lock, Globe } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { GuestContributionModal } from '@/components/auth/GuestContributionModal';
import { useBaskets } from '@/contexts/BasketContext';
import { useAuth } from '@/contexts/AuthContext';
import { formatCurrency } from '@/lib/formatters';

export const BasketDetailNonMember = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getBasket } = useBaskets();
  const { isGuest } = useAuth();
  const [showContributionModal, setShowContributionModal] = useState(false);

  const basket = getBasket(id || '');

  if (!basket) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
        <GlassCard variant="strong" size="lg" className="text-center">
          <h3 className="text-lg font-semibold mb-2 gradient-text">Basket not found</h3>
          <p className="text-white/70 mb-4">The basket you're looking for doesn't exist.</p>
          <EnhancedButton onClick={() => navigate('/')} variant="gradient">
            Back to Home
          </EnhancedButton>
        </GlassCard>
      </div>
    );
  }

  const handleContribute = () => {
    if (isGuest) {
      setShowContributionModal(true);
    } else {
      navigate(`/basket/${basket.id}/contribute`);
    }
  };

  const handleBack = () => navigate(-1);

  return (
    <div className="min-h-screen bg-gradient-hero pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-lg border-b border-white/10">
        <GlassCard variant="subtle" className="m-2 px-4 py-3 rounded-xl">
          <div className="flex items-center justify-between">
            <EnhancedButton 
              onClick={handleBack}
              variant="ghost"
              size="icon"
              className="hover:bg-white/10"
            >
              <ArrowLeft className="w-5 h-5" />
            </EnhancedButton>
            
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-primary text-white text-sm">
              {basket.privacy === 'private' ? (
                <>
                  <Lock className="w-3 h-3" />
                  <span>Private</span>
                </>
              ) : (
                <>
                  <Globe className="w-3 h-3" />
                  <span>Public</span>
                </>
              )}
            </div>
          </div>
        </GlassCard>
      </header>

      <div className="p-4 space-y-6">
        {/* Basket Header */}
        <GlassCard variant="default" size="lg" className="animate-scale-in">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold gradient-text mb-2">{basket.name}</h1>
              <div className="flex items-center gap-4 text-sm text-white/70">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{basket.participants} members</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{basket.daysLeft} days left</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold gradient-text-blue">
                {formatCurrency(basket.currentAmount)}
              </div>
              <div className="text-sm text-white/70">
                of {formatCurrency(basket.goal)}
              </div>
            </div>
          </div>

          <p className="text-white/80 mb-6">{basket.description}</p>

          {/* Progress */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-white/70">Progress</span>
              <span className="font-semibold gradient-text-blue">{basket.progress}%</span>
            </div>
            
            <div className="relative h-3 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="absolute inset-y-0 left-0 bg-gradient-primary rounded-full transition-all duration-700"
                style={{ width: `${Math.min(basket.progress, 100)}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-white/70">{formatCurrency(basket.currentAmount)}</span>
              <div className="flex items-center gap-1 text-white/70">
                <Target className="w-4 h-4" />
                <span>{formatCurrency(basket.goal)}</span>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* My Contribution Card */}
        <GlassCard variant="default" size="lg" className="animate-slide-up">
          <h3 className="text-lg font-semibold mb-4 text-white">My Contribution</h3>
          <div className="text-center py-8">
            <div className="text-3xl font-bold text-white/50 mb-2">
              {formatCurrency(0)}
            </div>
            <p className="text-white/70 text-sm">
              {isGuest ? 'Contribute as guest or join this basket' : 'Join this basket to start contributing'}
            </p>
          </div>
        </GlassCard>

        {/* Contribute Button */}
        <div className="fixed bottom-6 left-4 right-4">
          <EnhancedButton
            variant="gradient"
            size="xl"
            fullWidth
            onClick={handleContribute}
            className="shadow-glass-xl"
          >
            {isGuest ? 'Contribute as Guest' : 'Join Basket'}
          </EnhancedButton>
        </div>
      </div>

      {/* Guest Contribution Modal */}
      <GuestContributionModal
        isOpen={showContributionModal}
        onClose={() => setShowContributionModal(false)}
        basketId={basket.id}
        basketName={basket.name}
        onSuccess={() => {
          // Refresh basket data or show success message
          console.log('Contribution successful');
        }}
      />
    </div>
  );
};
