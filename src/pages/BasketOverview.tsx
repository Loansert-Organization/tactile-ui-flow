
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ContributionSuccessModal } from '@/components/ContributionSuccessModal';
import { BasketHeader } from '@/components/basket/BasketHeader';
import { FinancialSummary } from '@/components/basket/FinancialSummary';
import { BasketActions } from '@/components/basket/BasketActions';
import { BasketStats } from '@/components/basket/BasketStats';

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
    totalContributions: 32500,
    bankBalance: 31800,
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

  const handleShare = () => {
    // Share functionality
  };

  const handleSettings = () => {
    navigate(`/basket/${id}/settings`);
  };

  const handleContribute = () => {
    navigate(`/basket/${id}/contribute`);
  };

  const handleViewMembers = () => {
    navigate(`/basket/${id}/participants`);
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Header with back button */}
      <div className="p-6">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate('/baskets/mine')}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors mr-4"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold">Basket Details</h1>
        </div>
      </div>

      {/* Hero Section */}
      <div className="px-6 mb-6">
        <BasketHeader
          basket={basket}
          onShare={handleShare}
          onSettings={handleSettings}
        />
      </div>

      {/* Financial Summary */}
      <div className="px-6 mb-6">
        <FinancialSummary
          totalContributions={basket.totalContributions}
          bankBalance={basket.bankBalance}
          myContribution={basket.myContribution}
        />
      </div>

      {/* Action Buttons */}
      <div className="px-6 mb-6">
        <BasketActions
          basketId={id!}
          onContribute={handleContribute}
          onViewMembers={handleViewMembers}
        />
      </div>

      {/* Quick Stats */}
      <div className="px-6">
        <BasketStats
          totalContributions={basket.totalContributions}
          participants={basket.participants}
          goal={basket.goal}
        />
      </div>

      <ContributionSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        amount={contributedAmount}
        basketName={basket.name}
        basketId={id}
      />
    </div>
  );
};
