import React, { useState } from 'react';
import { Lock, Users, Target, Check, Plus, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '@/components/ui/glass-card';
import { GradientButton } from '@/components/ui/gradient-button';
import { ContributionModal } from '@/components/ContributionModal';
import { ContributionSuccessModal } from '@/components/ContributionSuccessModal';
import { usePressFeedback } from '@/hooks/useInteractions';
import { toast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/formatters';
import { useMyBasketsContext } from '@/contexts/MyBasketsContext';

interface BasketCardProps {
  id: string;
  name: string;
  description: string;
  privacy?: 'public' | 'private';
  progress: number;
  goal?: number;
  currentAmount?: number;
  participants?: number;
  isMember: boolean;
  myContribution: number;
  daysLeft?: number;
  onJoinSuccess?: () => void;
  showOnHomeScreen?: boolean; // New prop to determine if shown on home screen or my baskets
}

export const BasketCard = ({
  id,
  name,
  description,
  privacy = 'private',
  progress,
  goal,
  currentAmount,
  participants = 0,
  isMember,
  myContribution,
  daysLeft,
  onJoinSuccess,
  showOnHomeScreen = false
}: BasketCardProps) => {
  const [showContributionModal, setShowContributionModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [contributedAmount, setContributedAmount] = useState(0);
  const [isJoined, setIsJoined] = useState(false);
  const { handlePress } = usePressFeedback();
  const navigate = useNavigate();
  const { joinBasket, isJoining } = useMyBasketsContext();

  const isPublic = privacy === 'public';
  const isPrivate = privacy === 'private';

  const handleJoinBasket = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    
    // Navigate to contribution page instead of joining directly
    navigate(`/basket/${id}/contribute`);
  };

  const handlePrimaryAction = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    
    if (showOnHomeScreen) {
      // Home screen logic
      if (isMember) {
        // Already a member - show contribution modal
        setShowContributionModal(true);
      } else {
        // Not a member - navigate to join/contribute
        await handleJoinBasket(e);
      }
    } else {
      // My Baskets screen logic - always show contribution modal for members
      setShowContributionModal(true);
    }
  };

  const handleSecondaryAction = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (isMember) {
      // For members: "View Members" - navigate to participants
      navigate(`/basket/${id}/participants`);
    } else {
      // For non-members: "View Details" - navigate to non-member detail
      navigate(`/basket/${id}/join`);
    }
  };

  const handleContributionSuccess = (amount: number) => {
    setContributedAmount(amount);
    setShowSuccessModal(true);
    toast({
      title: "Payment Successful!",
      description: `You've contributed ${formatCurrency(amount)} to ${name}`
    });
  };

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isMember) return;
    handlePress(e);
    navigate(`/basket/${id}`);
  };

  const isCurrentlyJoining = isJoining === id;

  return (
    <>
      <GlassCard 
        hover={isMember} 
        className={`p-6 space-y-4 group transition-all duration-300 ${
          isMember ? 'cursor-pointer' : ''
        } ${isJoined ? 'animate-pulse' : ''}`} 
        onClick={handleCardClick} 
        role="article" 
        aria-label={`Basket: ${name}`} 
        tabIndex={0}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-purple-pink flex items-center justify-center">
              <span className="text-xl font-bold text-white">
                {name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="text-fluid-base group-hover:gradient-text transition-all duration-300 font-semibold">
                {name}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Users className="w-4 h-4" />
                <span>{participants}</span>
              </div>
            </div>
          </div>
        </div>

        {/* My Contribution (only show for members or if non-zero) */}
        {(isMember || myContribution > 0) && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">My Contribution</span>
            <span className="font-semibold gradient-text-blue">
              {formatCurrency(myContribution)}
            </span>
          </div>
        )}

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Progress</span>
            <span className="font-semibold gradient-text-blue">{progress}%</span>
          </div>
          
          <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="absolute inset-y-0 left-0 bg-gradient-teal-blue rounded-full transition-all duration-700 ease-out" 
              style={{ width: `${Math.min(progress, 100)}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </div>
          </div>

          {goal && currentAmount && (
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>{formatCurrency(currentAmount)}</span>
              <div className="flex items-center gap-1">
                <Target className="w-3 h-3" />
                <span>{formatCurrency(goal)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-2">
          {isPrivate ? null : (
            <div className="flex gap-3">
              {/* Primary Action */}
              <GradientButton 
                variant={
                  showOnHomeScreen && isMember ? "secondary" : "primary"
                }
                size="md" 
                className={`flex-1 transition-all duration-300 ${
                  showOnHomeScreen && isMember ? 'bg-green-500/20 hover:bg-green-500/30 border border-green-500/50' : ''
                }`}
                onClick={handlePrimaryAction} 
                loading={isCurrentlyJoining}
                disabled={isJoined}
                style={{ minHeight: '44px' }}
                aria-label={
                  showOnHomeScreen 
                    ? (isMember ? 'Already a member' : 'Join Basket')
                    : 'Contribute to basket'
                }
              >
                {showOnHomeScreen ? (
                  isMember ? (
                    <Check className="w-5 h-5 text-green-400" />
                  ) : (
                    <Plus className="w-5 h-5" />
                  )
                ) : (
                  <Plus className="w-5 h-5" />
                )}
              </GradientButton>

              {/* Secondary Action */}
              <GradientButton 
                variant="secondary" 
                size="md" 
                className="flex-1" 
                onClick={handleSecondaryAction}
                style={{ minHeight: '44px' }}
                aria-label={isMember ? 'View Members' : 'View Details'}
              >
                <Eye className="w-5 h-5" />
              </GradientButton>
            </div>
          )}
        </div>
      </GlassCard>

      <ContributionModal 
        isOpen={showContributionModal} 
        onClose={() => setShowContributionModal(false)} 
        basketName={name} 
        onSuccess={handleContributionSuccess} 
      />

      <ContributionSuccessModal 
        isOpen={showSuccessModal} 
        onClose={() => setShowSuccessModal(false)} 
        amount={contributedAmount} 
        basketName={name} 
      />
    </>
  );
};
