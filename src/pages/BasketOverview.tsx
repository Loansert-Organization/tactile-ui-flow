
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, MessageCircle, Settings, Share2, Target, Calendar } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { GradientButton } from '@/components/ui/gradient-button';

export const BasketOverview = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock basket data
  const basket = {
    id,
    name: 'Lakers Championship Ring Fund',
    description: 'Supporting our team to get that championship ring! Every contribution counts towards our goal.',
    goal: 50000,
    currentAmount: 32500,
    participants: 47,
    progress: 65,
    daysLeft: 45,
    isOwner: true
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Hero Section */}
      <div className="p-6 bg-gradient-to-br from-purple-900 via-blue-900 to-teal-900">
        <GlassCard className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-xl bg-gradient-purple-pink flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {basket.name.charAt(0)}
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
            <div className="flex gap-2">
              <button
                onClick={() => {/* Share functionality */}}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                <Share2 className="w-5 h-5" />
              </button>
              {basket.isOwner && (
                <button
                  onClick={() => navigate(`/basket/${id}/settings`)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <Settings className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          <p className="text-gray-300 mb-6">{basket.description}</p>

          {/* Progress Section */}
          <div className="space-y-3">
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
              <span className="text-gray-400">RWF {basket.currentAmount.toLocaleString()}</span>
              <div className="flex items-center gap-1 text-gray-400">
                <Target className="w-4 h-4" />
                <span>RWF {basket.goal.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Action Buttons */}
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <GradientButton
            variant="primary"
            onClick={() => navigate(`/basket/${id}/chat`)}
            className="flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            View Chat
          </GradientButton>
          <GradientButton
            variant="secondary"
            onClick={() => {/* Open contribution modal */}}
            className="flex items-center justify-center gap-2"
          >
            <Target className="w-5 h-5" />
            Contribute
          </GradientButton>
        </div>

        <GradientButton
          variant="accent"
          onClick={() => navigate(`/basket/${id}/participants`)}
          className="w-full flex items-center justify-center gap-2"
        >
          <Users className="w-5 h-5" />
          View Participants ({basket.participants})
        </GradientButton>
      </div>

      {/* Quick Stats */}
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
        <div className="grid grid-cols-2 gap-4">
          <GlassCard className="p-4 text-center">
            <div className="text-2xl font-bold gradient-text mb-1">
              RWF {(basket.currentAmount / basket.participants).toLocaleString()}
            </div>
            <div className="text-sm text-gray-400">Avg per member</div>
          </GlassCard>
          <GlassCard className="p-4 text-center">
            <div className="text-2xl font-bold gradient-text mb-1">
              RWF {(basket.goal - basket.currentAmount).toLocaleString()}
            </div>
            <div className="text-sm text-gray-400">Remaining</div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};
