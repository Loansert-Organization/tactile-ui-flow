
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Users, Settings, Share2, Target, Calendar, ArrowLeft, Plus, Banknote, Coins } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { GradientButton } from '@/components/ui/gradient-button';
import { ContributionSuccessModal } from '@/components/ContributionSuccessModal';

export const BasketOverview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [contributedAmount, setContributedAmount] = useState(0);

  // Mock basket data
  const basket = {
    id,
    name: 'Lakers Championship Ring Fund',
    description: 'Supporting our team to get that championship ring! Every contribution counts towards our goal.',
    goal: 50000,
    totalContributions: 32500, // Sum of all member contributions
    bankBalance: 31800, // Actual amount in the bank account
    participants: 47,
    progress: 65,
    daysLeft: 45,
    isOwner: true,
    myContribution: 2500
  };

  const handleContributionSuccess = (amount: number) => {
    setContributedAmount(amount);
    setShowSuccessModal(true);
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Header with back button */}
      <div className="p-6">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors mr-4"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold">Basket Details</h1>
        </div>
      </div>

      {/* Hero Section */}
      <div className="px-6 mb-6">
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
              <span className="text-gray-400">RWF {basket.totalContributions.toLocaleString()}</span>
              <div className="flex items-center gap-1 text-gray-400">
                <Target className="w-4 h-4" />
                <span>RWF {basket.goal.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Financial Summary */}
      <div className="px-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Financial Summary</h2>
        <div className="grid grid-cols-2 gap-4">
          <GlassCard className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Coins className="w-6 h-6 text-blue-400" />
            </div>
            <div className="text-2xl font-bold gradient-text mb-1">
              RWF {basket.totalContributions.toLocaleString()}
            </div>
            <div className="text-sm text-gray-400">Total Contributions</div>
          </GlassCard>
          <GlassCard className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Banknote className="w-6 h-6 text-green-400" />
            </div>
            <div className="text-2xl font-bold gradient-text mb-1">
              RWF {basket.bankBalance.toLocaleString()}
            </div>
            <div className="text-sm text-gray-400">Bank Balance</div>
          </GlassCard>
        </div>
      </div>

      {/* My Contribution */}
      <div className="px-6 mb-6">
        <GlassCard className="p-4 text-center">
          <div className="text-2xl font-bold gradient-text mb-1">
            RWF {basket.myContribution.toLocaleString()}
          </div>
          <div className="text-sm text-gray-400">My Contribution</div>
        </GlassCard>
      </div>

      {/* Action Buttons */}
      <div className="px-6 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <GradientButton
            variant="primary"
            onClick={() => navigate(`/basket/${id}/contribute`)}
            className="flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Contribute More
          </GradientButton>
          <GradientButton
            variant="secondary"
            onClick={() => navigate(`/basket/${id}/participants`)}
            className="flex items-center justify-center gap-2"
          >
            <Users className="w-5 h-5" />
            View Members
          </GradientButton>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="px-6">
        <h2 className="text-lg font-semibold mb-4">Statistics</h2>
        <div className="grid grid-cols-2 gap-4">
          <GlassCard className="p-4 text-center">
            <div className="text-xl font-bold gradient-text mb-1">
              RWF {Math.round(basket.totalContributions / basket.participants).toLocaleString()}
            </div>
            <div className="text-sm text-gray-400">Avg per member</div>
          </GlassCard>
          <GlassCard className="p-4 text-center">
            <div className="text-xl font-bold gradient-text mb-1">
              RWF {(basket.goal - basket.totalContributions).toLocaleString()}
            </div>
            <div className="text-sm text-gray-400">Remaining</div>
          </GlassCard>
        </div>
      </div>

      <ContributionSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        amount={contributedAmount}
        basketName={basket.name}
      />
    </div>
  );
};
