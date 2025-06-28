
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, QrCode } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { ContributionSuccessModal } from '@/components/ContributionSuccessModal';
import { BasketHeader } from '@/components/basket/BasketHeader';
import { FinancialSummary } from '@/components/basket/FinancialSummary';
import { BasketActions } from '@/components/basket/BasketActions';
import { BasketStats } from '@/components/basket/BasketStats';
import { QRCodeModal } from '@/components/QRCodeModal';

export const BasketOverview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [contributedAmount, setContributedAmount] = useState(0);

  // Mock basket data
  const basket = {
    id,
    name: 'Lakers Championship Ring Fund',
    description: 'Supporting our team to get that championship ring! Every contribution counts towards our goal.',
    goal: 500000,
    totalContributions: 325000,
    bankBalance: 318000,
    participants: 47,
    progress: 65,
    daysLeft: 45,
    isOwner: true,
    myContribution: 25000
  };

  const handleContributionSuccess = (amount: number) => {
    setContributedAmount(amount);
    setShowSuccessModal(true);
  };

  const handleShare = () => {
    // Share functionality is now handled in BasketHeader
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
    <div className="min-h-screen bg-gradient-hero pb-24">
      {/* Header with back button */}
      <div className="p-4">
        <GlassCard variant="subtle" className="flex items-center justify-between mb-6 p-4">
          <div className="flex items-center">
            <EnhancedButton
              onClick={() => navigate('/baskets/mine')}
              variant="ghost"
              size="icon"
              className="mr-4 hover:bg-white/10"
            >
              <ArrowLeft className="w-6 h-6" />
            </EnhancedButton>
            <h1 className="text-xl font-bold gradient-text">Basket Details</h1>
          </div>
          <EnhancedButton
            onClick={() => setShowQRModal(true)}
            variant="glass"
            size="icon"
            className="shadow-glass-md"
            aria-label="Generate QR Code"
          >
            <QrCode className="w-6 h-6 text-blue-400" />
          </EnhancedButton>
        </GlassCard>
      </div>

      {/* Hero Section */}
      <div className="px-4 sm:px-6 mb-6">
        <BasketHeader
          basket={basket}
          onShare={handleShare}
          onSettings={handleSettings}
        />
      </div>

      {/* Financial Summary */}
      <div className="px-4 sm:px-6 mb-6">
        <FinancialSummary
          totalContributions={basket.totalContributions}
          bankBalance={basket.bankBalance}
          myContribution={basket.myContribution}
        />
      </div>

      {/* Action Buttons */}
      <div className="px-4 sm:px-6 mb-6">
        <BasketActions
          basketId={id!}
          onContribute={handleContribute}
          onViewMembers={handleViewMembers}
        />
      </div>

      {/* Quick Stats */}
      <div className="px-4 sm:px-6">
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

      <QRCodeModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        basketId={id!}
        basketName={basket.name}
        basketURL={`${window.location.origin}/basket/${id}`}
      />
    </div>
  );
};
