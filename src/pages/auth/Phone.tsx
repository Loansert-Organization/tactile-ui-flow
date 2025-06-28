
import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PhoneInput } from '@/components/auth/PhoneInput';
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';
import { useNavigate } from 'react-router-dom';
import { requestWhatsAppOtp } from '@/services/auth';
import { toast } from 'sonner';

export const Phone = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber || phoneNumber.length !== 9) {
      toast.error('Please enter a valid 9-digit phone number');
      return;
    }

    setIsLoading(true);
    
    try {
      const formattedNumber = `+250${phoneNumber}`;
      await requestWhatsAppOtp(formattedNumber);
      
      // Store the phone number for the OTP verification step
      sessionStorage.setItem('pendingWhatsAppNumber', formattedNumber);
      
      navigate('/auth/otp');
    } catch (error) {
      console.error('Error requesting OTP:', error);
      toast.error('Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-sm mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">Sign In</h1>
        </div>

        <div className="space-y-6">
          {/* Google Sign In */}
          <div className="space-y-4">
            <GoogleSignInButton 
              variant="default" 
              size="lg" 
              className="w-full"
            />
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  or
                </span>
              </div>
            </div>
          </div>

          {/* WhatsApp Phone Auth */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-lg font-medium">Continue with WhatsApp</h2>
              <p className="text-sm text-gray-600">
                We'll send you a verification code via WhatsApp
              </p>
            </div>

            <PhoneInput
              value={phoneNumber}
              onChange={setPhoneNumber}
            />

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isLoading || !phoneNumber}
            >
              {isLoading ? 'Sending...' : 'Send Code'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
