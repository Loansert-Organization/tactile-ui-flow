
import React from 'react';
import { Check, Share2 } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { GradientButton } from '@/components/ui/gradient-button';

interface ContributionSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  basketName: string;
}

export const ContributionSuccessModal = ({ 
  isOpen, 
  onClose, 
  amount, 
  basketName 
}: ContributionSuccessModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm">
      <GlassCard className="w-full max-w-md p-8 text-center">
        {/* Success Animation */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center">
          <Check className="w-10 h-10 text-white animate-bounce" />
        </div>

        <h2 className="text-2xl font-bold gradient-text mb-2">Contribution Successful!</h2>
        <p className="text-gray-400 mb-6">
          You've contributed RWF {amount.toLocaleString()} to {basketName}
        </p>

        {/* Confetti Animation Placeholder */}
        <div className="relative mb-6">
          <div className="text-4xl animate-bounce">🎉</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 border-4 border-pink-500/20 rounded-full animate-ping" />
          </div>
        </div>

        <div className="space-y-3">
          <GradientButton
            variant="secondary"
            className="w-full"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share Achievement
          </GradientButton>

          <GradientButton
            variant="primary"
            className="w-full"
            onClick={onClose}
          >
            Continue
          </GradientButton>
        </div>
      </GlassCard>
    </div>
  );
};
