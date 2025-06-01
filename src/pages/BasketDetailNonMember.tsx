
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Calendar, Target } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { GradientButton } from '@/components/ui/gradient-button';
import { ShareButton } from '@/components/ui/share-button';
import { useBaskets } from '@/contexts/BasketContext';
import { formatCurrency } from '@/lib/formatters';

export default function BasketDetailNonMember() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getBasketById, joinBasket } = useBaskets();
  
  const basket = getBasketById(id || '');
  
  if (!basket) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Basket Not Found</h2>
          <p className="text-gray-400 mb-6">The basket you're looking for doesn't exist.</p>
          <GradientButton onClick={() => navigate('/')}>
            Back to Feed
          </GradientButton>
        </div>
      </div>
    );
  }

  const basketURL = `${window.location.origin}/basket/${id}`;

  const handleJoin = () => {
    if (id) {
      joinBasket(id);
      navigate(`/basket/${id}`);
    }
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold gradient-text">Join Basket</h1>
        </div>

        {/* Basket Details */}
        <GlassCard className="p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold gradient-text mb-2">{basket.name}</h2>
              <p className="text-gray-400 mb-4">{basket.description}</p>
              
              <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
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
            <ShareButton 
              basketName={basket.name} 
              basketURL={basketURL}
              size="md"
            />
          </div>

          {/* Progress Section */}
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Progress</span>
              <span className="font-semibold gradient-text-blue">{basket.progress}%</span>
            </div>
            
            <div className="relative h-3 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="absolute inset-y-0 left-0 bg-gradient-teal-blue rounded-full transition-all duration-700"
                style={{ width: `${basket.progress}%` }}
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

          {/* Join Button */}
          <GradientButton
            variant="primary"
            onClick={handleJoin}
            className="w-full"
            size="lg"
          >
            Join This Basket
          </GradientButton>
        </GlassCard>

        {/* Additional Info */}
        <GlassCard className="p-6">
          <h3 className="font-semibold mb-3">About This Basket</h3>
          <div className="space-y-3 text-sm text-gray-400">
            <div className="flex justify-between">
              <span>Goal Amount:</span>
              <span className="text-white">{formatCurrency(basket.goal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Current Amount:</span>
              <span className="text-white">{formatCurrency(basket.currentAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span>Remaining:</span>
              <span className="text-white">{formatCurrency(basket.goal - basket.currentAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span>Average per Member:</span>
              <span className="text-white">{formatCurrency(Math.round(basket.currentAmount / basket.participants))}</span>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
