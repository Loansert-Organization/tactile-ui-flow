
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Phone } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { GradientButton } from '@/components/ui/gradient-button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ContributionSuccessModal } from '@/components/ContributionSuccessModal';
import { toast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/formatters';

export const ContributionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [contributedAmount, setContributedAmount] = useState(0);

  // Mock basket data - in real app this would come from props or API
  const basketName = 'Lakers Championship Ring Fund';
  const basketCreatorPhone = '0788787878'; // Set by basket creator
  const basketProfileImage = 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=400&fit=crop&crop=center'; // Mock image

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

  const launchUSSDDialer = (phoneNumber: string, amount: string) => {
    // Remove commas and format the amount
    const cleanAmount = amount.replace(/,/g, '');
    // Clean phone number (remove any non-digits)
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    
    // Create USSD code: *182*1*1*[payment number]*[amount]#
    const ussdCode = `*182*1*1*${cleanPhone}*${cleanAmount}#`;
    
    // Create tel: URL to launch phone dialer
    const telUrl = `tel:${encodeURIComponent(ussdCode)}`;
    
    // Launch the dialer
    window.location.href = telUrl;
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
    
    // Launch USSD dialer immediately
    launchUSSDDialer(basketCreatorPhone, amount);
    
    // Show toast notification
    toast({
      title: "USSD Dialer Launched",
      description: "Complete the payment on your phone",
    });

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      // Remove commas before converting to number
      const numericAmount = Number(amount.replace(/,/g, ''));
      setContributedAmount(numericAmount);
      setShowSuccessModal(true);
      setAmount('');
    }, 3000);
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="p-6">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors mr-4"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold">Contribute to Basket</h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 space-y-6">
        {/* Basket Info */}
        <GlassCard className="p-6 text-center">
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={basketProfileImage} alt={basketName} />
              <AvatarFallback className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-orange-500 text-white">
                {basketName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-bold gradient-text">{basketName}</h2>
          </div>
        </GlassCard>

        {/* Contribution Form */}
        <GlassCard className="p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-3 text-gray-300">Amount (RWF)</label>
              <div className="relative">
                <CreditCard className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={amount}
                  onChange={handleAmountChange}
                  placeholder="1,000"
                  className="w-full pl-14 pr-4 py-4 text-lg rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-3 text-gray-300">Payment Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  value={basketCreatorPhone}
                  readOnly
                  className="w-full pl-14 pr-4 py-4 text-lg rounded-lg bg-gray-100/10 border border-white/10 text-gray-400 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              <GradientButton
                variant="primary"
                className="w-full py-4 text-lg"
                onClick={handleContribute}
                loading={isProcessing}
                disabled={!amount}
              >
                {isProcessing ? 'Processing Payment...' : 'Pay with Mobile Money'}
              </GradientButton>
              
              <button
                onClick={() => navigate(-1)}
                className="w-full px-4 py-4 rounded-lg border border-white/20 hover:bg-white/10 transition-colors text-center"
              >
                Cancel
              </button>
            </div>
          </div>
        </GlassCard>

        {/* Additional Info */}
        <GlassCard className="p-4">
          <div className="text-center">
            <p className="text-sm text-gray-400">
              Secure payment powered by Mobile Money
            </p>
          </div>
        </GlassCard>
      </div>

      {/* Success Modal */}
      <ContributionSuccessModal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        amount={contributedAmount}
        basketName={basketName}
        basketId={id}
      />
    </div>
  );
};
