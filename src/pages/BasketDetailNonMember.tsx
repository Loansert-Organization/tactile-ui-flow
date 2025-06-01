
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBaskets } from '@/contexts/BasketContext';
import { GlassCard } from '@/components/ui/glass-card';
import { GradientButton } from '@/components/ui/gradient-button';
import { formatCurrency } from '@/lib/formatters';
import { Users, Target, Calendar, Plus, ArrowLeft } from 'lucide-react';

export default function BasketDetailNonMember() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getBasket } = useBaskets();
  
  const basket = getBasket(id || '');

  if (!basket) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Basket Not Found</h2>
          <p className="text-gray-400 mb-6">The basket you're looking for doesn't exist.</p>
          <GradientButton onClick={() => navigate('/feed')}>
            Browse Baskets
          </GradientButton>
        </div>
      </div>
    );
  }

  const handleJoin = () => {
    navigate(`/basket/${id}/contribute`);
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>

        {/* Basket Header */}
        <GlassCard className="p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-16 h-16 rounded-xl bg-gradient-purple-pink flex items-center justify-center">
              <span className="text-2xl font-bold text-white">
                {basket.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">{basket.name}</h1>
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
          </div>

          <p className="text-gray-300 mb-6">{basket.description}</p>

          {/* Progress */}
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
            size="lg"
            onClick={handleJoin}
            className="w-full"
          >
            <Plus className="w-5 h-5" />
            Join This Basket
          </GradientButton>
        </GlassCard>

        {/* Additional Info */}
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold mb-4">About This Basket</h3>
          <div className="space-y-3 text-sm text-gray-300">
            <div className="flex justify-between">
              <span>Goal Amount:</span>
              <span className="font-semibold">{formatCurrency(basket.goal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Current Amount:</span>
              <span className="font-semibold">{formatCurrency(basket.currentAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span>Members:</span>
              <span className="font-semibold">{basket.participants}</span>
            </div>
            <div className="flex justify-between">
              <span>Time Remaining:</span>
              <span className="font-semibold">{basket.daysLeft} days</span>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
