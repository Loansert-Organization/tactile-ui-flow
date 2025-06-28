import React, { useState, useEffect } from 'react';
import { X, CreditCard, Wallet } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';
import { useWallet } from '@/hooks/useWallet';
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
  const { user } = useAuthContext();
  const { wallet, fetchWallet, processContribution } = useWallet();
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'ussd'>('ussd');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [contributedAmount, setContributedAmount] = useState(0);
  const [basketCreatorPhone, setBasketCreatorPhone] = useState('');
  
  // Fetch wallet and basket creator phone on mount
  useEffect(() => {
    if (isOpen && user?.id) {
      fetchWallet();
      fetchBasketCreatorPhone();
    }
  }, [isOpen, user?.id, fetchWallet]);

  const fetchBasketCreatorPhone = async () => {
    if (!basketId) return;

    try {
      const { data, error } = await supabase
        .from('baskets')
        .select('user_id')
        .eq('id', basketId)
        .single();

      if (error) {
        if (import.meta.env.DEV) console.error('Error fetching basket creator:', error);
        return;
      }

      // Fetch creator's phone number
      const { data: creatorData } = await supabase
        .from('users')
        .select('mobile_money_number')
        .eq('id', data.user_id)
        .single();

      setBasketCreatorPhone(creatorData?.mobile_money_number || '0788787878');
    } catch (err) {
      if (import.meta.env.DEV) console.error('Error fetching basket creator phone:', err);
      setBasketCreatorPhone('0788787878');
    }
  };

  if (!isOpen) return null;

  const formatNumber = (value: string) => {
    // Remove all non-digits
    const cleanValue = value.replace(/\D/g, '');
    // Add commas for thousands
    return cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const formattedValue = formatNumber(value);
    setAmount(formattedValue);
  };

  const handleContribute = async () => {
    if (!amount || !basketId || !user?.id) {
      toast.error('Please enter the amount');
      return;
    }

    const numericAmount = Number(amount.replace(/,/g, ''));
    if (numericAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    // Check wallet balance if using wallet payment
    if (paymentMethod === 'wallet' && wallet) {
      const amountUsd = numericAmount / 1300; // Approximate RWF to USD conversion
      if (wallet.balance_usd < amountUsd) {
        toast.error('Insufficient wallet balance');
        return;
      }
    }

    setIsProcessing(true);

    try {
      const numericAmount = Number(amount.replace(/,/g, ''));
      const amountUsd = numericAmount / 1300; // Approximate RWF to USD conversion

      const contribution = await processContribution(
        basketId,
        numericAmount,
        amountUsd,
        'RWF',
        paymentMethod
      );

      if (contribution) {
        setContributedAmount(numericAmount);
        onSuccess(numericAmount);
        setShowSuccessModal(true);
        setAmount('');
        
        if (paymentMethod === 'ussd') {
          toast.success('USSD code generated. Please complete payment on your phone.');
        } else {
          toast.success('Contribution successful!');
        }
      }
    } catch (error: any) {
      if (import.meta.env.DEV) console.error('Contribution error:', error);
      toast.error(error.message || 'Failed to process contribution');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    onClose();
  };

  const walletBalanceRwf = wallet ? Math.round(wallet.balance_usd * 1300) : 0;

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

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 truncate">Amount (RWF)</label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input 
                  type="text" 
                  value={amount} 
                  onChange={handleAmountChange} 
                  placeholder="1,000" 
                  className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-500" 
                />
              </div>
            </div>

            {/* Payment Method Selection */}
            <div>
              <label className="block text-sm font-medium mb-2">Payment Method</label>
              <div className="space-y-2">
                <label className="flex items-center space-x-3 p-3 rounded-lg border border-white/20 hover:bg-white/5 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="ussd"
                    checked={paymentMethod === 'ussd'}
                    onChange={() => setPaymentMethod('ussd')}
                    className="text-pink-500"
                  />
                  <div className="flex-1">
                    <div className="font-medium">USSD Payment</div>
                    <div className="text-sm text-gray-400">Pay via mobile money</div>
                  </div>
                </label>
                
                <label className="flex items-center space-x-3 p-3 rounded-lg border border-white/20 hover:bg-white/5 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="wallet"
                    checked={paymentMethod === 'wallet'}
                    onChange={() => setPaymentMethod('wallet')}
                    className="text-pink-500"
                  />
                  <div className="flex-1">
                    <div className="font-medium">Wallet Payment</div>
                    <div className="text-sm text-gray-400">
                      Balance: {walletBalanceRwf.toLocaleString()} RWF
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {paymentMethod === 'ussd' && (
              <div>
                <label className="block text-sm font-medium mb-2 truncate">Payment Number</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={basketCreatorPhone} 
                    readOnly
                    className="w-full px-4 py-3 rounded-lg bg-gray-100/10 border border-white/10 text-gray-400 cursor-not-allowed" 
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1 truncate">Set by basket creator</p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button onClick={onClose} className="flex-1 px-4 py-3 rounded-lg border border-white/20 hover:bg-white/10 transition-colors truncate">
                Cancel
              </button>
              <GradientButton 
                variant="primary" 
                className="flex-1" 
                onClick={handleContribute} 
                loading={isProcessing} 
                disabled={!amount || (paymentMethod === 'wallet' && walletBalanceRwf < Number(amount.replace(/,/g, '')))}
              >
                <span className="truncate">
                  {isProcessing ? 'Processing...' : 
                   paymentMethod === 'wallet' ? 'Pay with Wallet' : 'Pay with MOMO'}
                </span>
              </GradientButton>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Success Modal */}
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
