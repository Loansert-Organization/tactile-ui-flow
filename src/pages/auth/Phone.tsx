
import React, { useState } from 'react';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { PhoneInput } from '@/components/auth/PhoneInput';
import { toast } from '@/hooks/use-toast';
import { requestOtp } from '@/services/auth';

export const Phone = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleContinue = async () => {
    if (!phoneNumber || phoneNumber.length < 9) {
      setError('Please enter a valid phone number');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const sessionData = await requestOtp(`+250${phoneNumber}`);
      
      navigate('/auth/whatsapp', { 
        state: { 
          sessionId: sessionData.sessionId,
          phone: `+250${phoneNumber}`,
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
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto">
              <MessageCircle className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {t('auth.phoneTitle')}
              </h1>
              <p className="text-gray-600">
                {t('auth.phoneSubtitle')}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <PhoneInput
              value={phoneNumber}
              onChange={setPhoneNumber}
              error={error}
            />

            <Button
              onClick={handleContinue}
              disabled={!phoneNumber || phoneNumber.length < 9 || isLoading}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {t('common.loading')}
                </div>
              ) : (
                t('auth.continueWithWhatsApp')
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
