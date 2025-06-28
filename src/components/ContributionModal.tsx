import React, { useState } from 'react';
import { X, CreditCard, Wallet, Phone } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { GlassCard } from '@/components/ui/glass-card';
import { GradientButton } from '@/components/ui/gradient-button';
import { ContributionSuccessModal } from '@/components/ContributionSuccessModal';
import { toast } from 'sonner';

interface ContributionModalProps {
  isOpen: boolean;
  onClose: () => void;
  basketName: string;
  onSuccess: (amount: number) => void;
  basketId?: string;
}

export const ContributionModal = ({
  isOpen,
  onClose,
  basketName,
  onSuccess,
  basketId
}: ContributionModalProps) => {
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [contributedAmount, setContributedAmount] = useState(0);

  if (!isOpen) return null;

  const formatNumber = (value: string) => {
    const cleanValue = value.replace(/\\D/g, '');
    return cleanValue.replace(/\\B(?=(\\d{3})+(?!\\d))/g, ',');
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formattedValue = formatNumber(value);
    setAmount(formattedValue);
  };

  const handleContribute = async () => {
    if (!amount || !basketId) {
      toast.error('Please enter a valid amount.');
      return;
    }

    const numericAmount = Number(amount.replace(/,/g, ''));
    if (numericAmount <= 0) {
      toast.error('Please enter a valid amount.');
      return;
    }

    setIsProcessing(true);

    try {
      const amountUsd = numericAmount / 1300; // Approximate RWF to USD conversion

      const { data: momoCode, error } = await supabase.rpc('create_contribution_and_get_momo_code', {
        p_basket_id: basketId,
        p_amount_local: numericAmount,
        p_amount_usd: amountUsd
      });

      if (error) throw error;

      // Launch phone dialer with USSD code
      window.location.href = `tel:${momoCode.replace(/#/g, '%23')}`;

      // Show success message immediately
      setContributedAmount(numericAmount);
      onSuccess(numericAmount);
      setShowSuccessModal(true);
      setAmount('');

    } catch (error: any) {
      console.error('Contribution error:', error);
      toast.error(error.message || 'Failed to initiate contribution.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm">
        <GlassCard className="w-full max-w-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold gradient-text truncate flex-1 mr-4">Contribute to {basketName}</h2>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 transition-colors flex-shrink-0">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <label htmlFor="amount-input" className="block text-sm font-medium mb-2 truncate">Amount (RWF)</label>
              <div className="relative">
                <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/50" />
                <input 
                  id="amount-input"
                  type="text" 
                  value={amount} 
                  onChange={handleAmountChange} 
                  placeholder="e.g. 5,000" 
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/10 border-2 border-white/20 focus:outline-none focus:ring-2 focus:ring-primary text-lg font-semibold" 
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-white/20">
              <button onClick={onClose} className="flex-1 px-4 py-3 rounded-xl border-2 border-white/20 hover:bg-white/10 transition-colors truncate font-semibold">
                Cancel
              </button>
              <GradientButton 
                variant="primary" 
                className="flex-1" 
                onClick={handleContribute} 
                loading={isProcessing}
                disabled={!amount}
              >
                <Phone className="w-5 h-5 mr-2" />
                <span className="truncate">
                  {isProcessing ? 'Initiating...' : 'Pay with Mobile Money'}
                </span>
              </GradientButton>
            </div>
          </div>
        </GlassCard>
      </div>

      <ContributionSuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        amount={contributedAmount}
        basketName={basketName}
        basketId={basketId}
      />
    </>
  );
};
