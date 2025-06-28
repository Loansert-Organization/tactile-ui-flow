
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Phone } from 'lucide-react';
import { GradientButton } from '@/components/ui/gradient-button';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const WhatsAppLogin = () => {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) {
      toast.error('Please enter your phone number');
      return;
    }

    setIsLoading(true);

    try {
      // Format phone number (ensure it starts with +)
      let formattedPhone = phoneNumber.trim();
      if (!formattedPhone.startsWith('+')) {
        formattedPhone = '+' + formattedPhone.replace(/^\+/, '');
      }

      const { error } = await supabase.auth.signInWithOtp({
        phone: formattedPhone,
        options: {
          channel: 'whatsapp'
        }
      });
      
      if (error) throw error;
      
      toast.success('Check your WhatsApp for the verification code!');
      // Navigate to OTP verification screen
      navigate('/auth/verify-otp', { 
        state: { 
          phoneNumber: formattedPhone,
          method: 'whatsapp' 
        } 
      });
    } catch (error: any) {
      console.error('WhatsApp auth error:', error);
      toast.error(error.message || 'Failed to send WhatsApp code');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/login-options')}
            className="p-2 -ml-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </div>

        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-green-50 rounded-full flex items-center justify-center mb-6">
            <MessageCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Continue with WhatsApp
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            We'll send you a verification code via WhatsApp
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Phone Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Phone className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="phone"
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                placeholder="+1234567890"
                required
              />
            </div>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Include country code (e.g., +1 for US, +44 for UK)
            </p>
          </div>

          <GradientButton
            type="submit"
            variant="accent"
            size="lg"
            className="w-full"
            loading={isLoading}
          >
            <MessageCircle className="w-5 h-5" />
            Send WhatsApp Code
          </GradientButton>
        </form>

        {/* Info */}
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <p className="text-sm text-green-800 dark:text-green-200">
            <strong>Note:</strong> You'll receive a verification code on WhatsApp. Make sure your phone number is registered with WhatsApp.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppLogin;
