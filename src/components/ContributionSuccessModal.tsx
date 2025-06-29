import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { GradientButton } from '@/components/ui/gradient-button';
import { ShareButton } from '@/components/ui/share-button';
import { formatCurrency } from '@/lib/formatters';

interface ContributionSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  basketName: string;
  basketId?: string;
}

export const ContributionSuccessModal = ({ 
  isOpen, 
  onClose, 
  amount, 
  basketName,
  basketId 
}: ContributionSuccessModalProps) => {
  const navigate = useNavigate();
  
  if (!isOpen) return null;

  const basketURL = `${window.location.origin}/basket/${basketId || 'abc123'}`;

  const handleContinue = () => {
    onClose();
    if (basketId) {
      navigate(`/basket/${basketId}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm">
      <GlassCard className="w-full max-w-md p-8 text-center">
        {/* Success Animation */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center">
          <Check className="w-10 h-10 text-white animate-bounce" />
        </div>

        <h2 className="text-2xl font-bold gradient-text mb-2 truncate">Contribution Successful!</h2>
        <p className="text-gray-400 mb-6 line-clamp-2">
          You've contributed {formatCurrency(amount)} to {basketName}
        </p>

        {/* Confetti Animation Placeholder */}
        <div className="relative mb-6">
          <div className="text-4xl animate-bounce">🎉</div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 border-4 border-pink-500/20 rounded-full animate-ping" />
          </div>
        </div>

        <div className="space-y-3">
          {/* Share via WhatsApp */}
          <a
            href={`https://wa.me/?text=${encodeURIComponent(`I just contributed to ${basketName}! Join me in supporting this basket here: ${basketURL}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-full justify-center items-center px-4 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors"
          >
            Share on WhatsApp
          </a>

          <GradientButton
            variant="primary"
            className="w-full"
            onClick={handleContinue}
          >
            <span className="truncate">Close</span>
          </GradientButton>
        </div>
      </GlassCard>
    </div>
  );
};
