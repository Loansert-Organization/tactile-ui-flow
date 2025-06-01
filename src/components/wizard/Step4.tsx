
import React from 'react';
import { Check, Share2 } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { StepperBar } from './StepperBar';
import { StepProps } from '@/types/wizard';
import { toast } from 'sonner';

export const Step4: React.FC<StepProps> = ({ basketData, onBack, handlePress }) => {
  const shareBasket = () => {
    const basketUrl = `${window.location.origin}/basket/1`;
    const message = `Hey! Join my private Basket "${basketData.name}" and add your support via MOMO: ${basketUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    
    toast.success('📱 Opening WhatsApp…', {
      description: 'Redirecting to WhatsApp to share your basket',
      duration: 2000,
    });

    try {
      const opened = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      
      if (!opened || opened.closed || typeof opened.closed == 'undefined') {
        window.location.href = whatsappUrl;
      }
    } catch (error) {
      console.error('Error opening WhatsApp:', error);
      toast.error("Couldn't open WhatsApp", {
        description: 'Please try again or share the link manually',
        duration: 4000,
      });
    }
  };

  return (
    <div className="wizard-step">
      <GlassCard className="max-w-md mx-auto p-6 mt-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-teal-500/10" />
        
        <div className="relative">
          <StepperBar currentStep={2} />
          
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500/20 to-teal-500/20 rounded-full flex items-center justify-center mx-auto neuro-button">
              <Check className="w-10 h-10 text-green-400" />
            </div>

            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-teal-400 bg-clip-text text-transparent mb-2">
                Private Basket Created!
              </h1>
              <p className="text-gray-400">Your private savings basket is ready. Share the link to invite others!</p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={(e) => { handlePress(e); shareBasket(); }}
                className="w-full bg-gradient-to-r from-teal-500 to-blue-500 neuro-button text-white font-semibold py-3 text-base"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Basket Link
              </Button>

              <Button
                onClick={(e) => { handlePress(e); onBack(); }}
                variant="outline"
                className="w-full border-white/20 text-white hover:bg-white/10 neuro-button"
              >
                View My Baskets
              </Button>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
