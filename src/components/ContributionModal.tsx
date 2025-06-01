
import React, { useState } from 'react';
import { X, CreditCard } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { GradientButton } from '@/components/ui/gradient-button';
import { ContributionSuccessModal } from '@/components/ContributionSuccessModal';
import { toast } from '@/hooks/use-toast';

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
  
  // Phone number set by basket creator - not editable
  const basketCreatorPhone = '0788787878';

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
    if (!amount) {
      toast({
        title: "Missing Information",
        description: "Please enter the amount",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);

    // Simulate MOMO USSD launch
    toast({
      title: "MOMO Payment Initiated",
      description: "Please check your phone and complete the payment"
    });

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      // Remove commas before converting to number
      const numericAmount = Number(amount.replace(/,/g, ''));
      setContributedAmount(numericAmount);
      onSuccess(numericAmount);
      setShowSuccessModal(true);
      setAmount('');
    }, 3000);
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

            <div className="flex gap-3 pt-4">
              <button onClick={onClose} className="flex-1 px-4 py-3 rounded-lg border border-white/20 hover:bg-white/10 transition-colors truncate">
                Cancel
              </button>
              <GradientButton variant="primary" className="flex-1" onClick={handleContribute} loading={isProcessing} disabled={!amount}>
                <span className="truncate">{isProcessing ? 'Processing...' : 'Pay with MOMO'}</span>
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
