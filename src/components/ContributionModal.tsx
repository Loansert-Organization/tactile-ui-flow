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
    console.log('[CONTRIBUTE] Starting contribution process...');
    if (!amount || !basketId) {
      toast.error('Please enter a valid amount.');
      console.error('[CONTRIBUTE_ERROR] Missing amount or basketId.', { amount, basketId });
      return;
    }

    const numericAmount = Number(amount.replace(/,/g, ''));
    if (numericAmount <= 0) {
      toast.error('Please enter a valid amount.');
      console.error('[CONTRIBUTE_ERROR] Invalid numeric amount.', { numericAmount });
      return;
    }

    setIsProcessing(true);
    console.log(`[CONTRIBUTE] Processing amount: ${numericAmount} for basket: ${basketId}`);

    try {
      // 1️⃣ Generate the Mobile-Money USSD code via RPC
      console.log('[CONTRIBUTE] Generating momo code...');
      const { data: momoCode, error: momoError } = await supabase.rpc('generate_momo_code', {
        p_basket_id: basketId,
        p_amount: numericAmount
      });

      if (momoError) {
        console.error('[CONTRIBUTE_ERROR] Failed to generate momo code:', momoError);
        throw new Error(`Failed to generate payment code: ${momoError.message}`);
      }

      if (!momoCode) {
        console.error('[CONTRIBUTE_ERROR] RPC returned no momoCode.');
        throw new Error('Could not generate payment code. Please try again.');
      }

      console.log(`[CONTRIBUTE] momoCode generated: ${momoCode}`);

      // 2️⃣ Persist the contribution (optimistically) – respect RLS
      const { data: userResponse } = await supabase.auth.getUser();
      const userId = userResponse.user?.id;

      const { error: insertError } = await supabase.from('contributions').insert([
        {
          basket_id: basketId,
          user_id: userId,
          amount_local: numericAmount,
          currency: 'RWF',
          payment_method: 'ussd',
          momo_code: momoCode,
          confirmed: false
        }
      ]);

      if (insertError) {
        console.error('[CONTRIBUTE_ERROR] Failed to insert contribution:', insertError);
        throw new Error('Failed to log contribution. Please try again.');
      }

      // 3️⃣ Launch phone dialer with encoded USSD string
      console.log('[CONTRIBUTE] Launching phone dialer...');
      window.location.href = `tel:${encodeURIComponent(momoCode)}`;

      // 4️⃣ Show success UI
      console.log('[CONTRIBUTE] Showing success modal...');
      setContributedAmount(numericAmount);
      onSuccess(numericAmount);
      setShowSuccessModal(true);
      setAmount('');
      console.log('[CONTRIBUTE] Contribution process complete.');

    } catch (error: any) {
      console.error('[CONTRIBUTE_ERROR] Caught an exception in handleContribute:', error);
      toast.error(error.message || 'Failed to initiate contribution.');
    } finally {
      setIsProcessing(false);
      console.log('[CONTRIBUTE] Finished, processing set to false.');
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
