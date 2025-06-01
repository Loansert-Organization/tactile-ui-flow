import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Target, Calendar, Lock, Globe } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { GradientButton } from '@/components/ui/gradient-button';
import { useBaskets } from '@/contexts/BasketContext';
import { formatCurrency } from '@/lib/formatters';

const BasketDetailNonMember = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getBasket } = useBaskets();

  const basket = getBasket(id || '');

  if (!basket) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <GlassCard className="p-8 text-center">
          <h3 className="text-lg font-semibold mb-2">Basket not found</h3>
          <p className="text-gray-400 mb-4">The basket you're looking for doesn't exist.</p>
          <GradientButton onClick={() => navigate('/')} variant="primary">
            Back to Home
          </GradientButton>
        </GlassCard>
      </div>
    );
  }

  const handleJoinBasket = () => {
    navigate(`/basket/${basket.id}/contribute`);
  };

  const handleBack = () => navigate(-1);

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-white/10">
        <div className="flex items-center justify-between p-4">
          <button 
            onClick={handleBack}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-sm">
            {basket.isPrivate ? (
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
      </header>

      <div className="p-4 space-y-6">
        {/* Basket Header */}
        <GlassCard className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold gradient-text mb-2">{basket.name}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-400">
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
              <div className="text-sm text-gray-400">
                of {formatCurrency(basket.goal)}
              </div>
            </div>
          </div>

          <p className="text-gray-300 mb-6">{basket.description}</p>

          {/* Progress */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Progress</span>
              <span className="font-semibold gradient-text-blue">{basket.progress}%</span>
            </div>
            
            <div className="relative h-3 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="absolute inset-y-0 left-0 bg-gradient-teal-blue rounded-full transition-all duration-700"
                style={{ width: `${Math.min(basket.progress, 100)}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">{formatCurrency(basket.currentAmount)}</span>
              <div className="flex items-center gap-1 text-gray-400">
                <Target className="w-4 h-4" />
                <span>{formatCurrency(basket.goal)}</span>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* My Contribution Card */}
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold mb-4">My Contribution</h3>
          <div className="text-center py-8">
            <div className="text-3xl font-bold text-gray-500 mb-2">
              {formatCurrency(0)}
            </div>
            <p className="text-gray-400 text-sm">
              Join this basket to start contributing
            </p>
          </div>
        </GlassCard>

        {/* Join Basket Button */}
        <div className="fixed bottom-6 left-4 right-4">
          <GradientButton
            variant="primary"
            className="w-full py-4 text-lg font-semibold"
            onClick={handleJoinBasket}
          >
            Join Basket
          </GradientButton>
        </div>
      </div>
    </div>
  );
};

export default BasketDetailNonMember;
