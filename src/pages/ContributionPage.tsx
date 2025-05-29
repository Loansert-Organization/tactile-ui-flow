
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard, Phone } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { GradientButton } from '@/components/ui/gradient-button';
import { toast } from '@/hooks/use-toast';

export const ContributionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [amount, setAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Mock basket data - in real app this would come from props or API
  const basketName = 'Lakers Championship Ring Fund';

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
      description: "Please check your phone and complete the payment",
    });

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Payment Successful!",
        description: `Successfully contributed RWF ${amount} to ${basketName}`,
      });
      navigate(`/basket/${id}`);
      setAmount('');
      setPhoneNumber('');
    }, 3000);
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
          <h2 className="text-2xl font-bold gradient-text mb-2">{basketName}</h2>
          <p className="text-gray-300">Add your contribution to help reach the goal</p>
        </GlassCard>

        {/* Contribution Form */}
        <GlassCard className="p-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-3 text-gray-300">Amount (RWF)</label>
              <div className="relative">
                <CreditCard className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full pl-14 pr-4 py-4 text-lg rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
              <p className="text-xs text-gray-400 mt-2">Minimum contribution: RWF 1,000</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-3 text-gray-300">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="078XXXXXXX"
                  className="w-full pl-14 pr-4 py-4 text-lg rounded-lg bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>
              <p className="text-xs text-gray-400 mt-2">Enter your Mobile Money number</p>
            </div>

            {/* Payment Info */}
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <h3 className="font-semibold text-blue-300 mb-2">Payment Process</h3>
              <div className="space-y-2 text-sm text-blue-300">
                <p>• A USSD prompt will be sent to your phone</p>
                <p>• Complete the payment via Mobile Money</p>
                <p>• Your contribution will be added to the basket</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              <GradientButton
                variant="primary"
                className="w-full py-4 text-lg"
                onClick={handleContribute}
                loading={isProcessing}
                disabled={!amount || !phoneNumber}
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
    </div>
  );
};
