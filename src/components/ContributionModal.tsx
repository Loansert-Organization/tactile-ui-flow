
import React, { useState } from 'react';
import { X, CreditCard, Phone } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { GradientButton } from '@/components/ui/gradient-button';
import { toast } from '@/hooks/use-toast';
interface ContributionModalProps {
  isOpen: boolean;
  onClose: () => void;
  basketName: string;
  onSuccess: (amount: number) => void;
}
export const ContributionModal = ({
  isOpen,
  onClose,
  basketName,
  onSuccess
}: ContributionModalProps) => {
  const [amount, setAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  if (!isOpen) return null;
  const handleContribute = async () => {
    if (!amount || !phoneNumber) {
      toast({
        title: "Missing Information",
        description: "Please enter both amount and phone number",
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
      onSuccess(Number(amount));
      onClose();
      setAmount('');
      setPhoneNumber('');
    }, 3000);
  };
  return <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm">
      <GlassCard className="w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold gradient-text">Contribute to {basketName}</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Amount (RWF)</label>
            <div className="relative">
              <CreditCard className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Enter amount" className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input type="tel" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} placeholder="078XXXXXXX" className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-500" />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button onClick={onClose} className="flex-1 px-4 py-3 rounded-lg border border-white/20 hover:bg-white/10 transition-colors">
              Cancel
            </button>
            <GradientButton variant="primary" className="flex-1" onClick={handleContribute} loading={isProcessing} disabled={!amount || !phoneNumber}>
              {isProcessing ? 'Processing...' : 'Pay with MOMO'}
            </GradientButton>
          </div>
        </div>
      </GlassCard>
    </div>;
};
