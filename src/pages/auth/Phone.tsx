
import React, { useState } from 'react';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { PhoneInput } from '@/components/auth/PhoneInput';
import { toast } from '@/hooks/use-toast';
import { requestWhatsAppOtp } from '@/services/auth';

// Step 1: Simplified single WhatsApp authentication screen
export const Phone = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOtp = async () => {
    if (!whatsappNumber || whatsappNumber.length < 9) {
      setError('Please enter a valid WhatsApp number');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const sessionData = await requestWhatsAppOtp(`+250${whatsappNumber}`);
      
      toast({
        title: "OTP Sent!",
        description: "Check your WhatsApp for the verification code"
      });
      
      // Step 4: Direct navigation to OTP screen (no intermediate steps)
      navigate('/auth/otp', { 
        state: { 
          sessionId: sessionData.sessionId,
          whatsappNumber: sessionData.whatsappNumber,
          expiresIn: sessionData.expiresIn
        } 
      });
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-sm mx-auto">
        {/* Header */}
        <div className="flex items-center mb-12 pt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="p-2 -ml-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="space-y-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto">
              <MessageCircle className="w-8 h-8 text-green-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Enter WhatsApp Number
              </h1>
              <p className="text-gray-600">
                We'll send you a verification code on WhatsApp
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <PhoneInput
              value={whatsappNumber}
              onChange={setWhatsappNumber}
              error={error}
            />

            <Button
              onClick={handleSendOtp}
              disabled={!whatsappNumber || whatsappNumber.length < 9 || isLoading}
              className="w-full h-12 bg-green-600 hover:bg-green-700 text-white rounded-lg"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending OTP...
                </div>
              ) : (
                <>
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Send WhatsApp OTP
                </>
              )}
            </Button>

            {/* Demo Note */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-xs text-green-800">
                <strong>Demo:</strong> Enter any valid number format to continue
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
