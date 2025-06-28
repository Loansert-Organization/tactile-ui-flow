
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Mail } from 'lucide-react';
import { GradientButton } from '@/components/ui/gradient-button';
import { Button } from '@/components/ui/button';
import { OtpInput } from '@/components/auth/OtpInput';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const OtpVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(60);

  const { phoneNumber, email, method } = location.state || {};

  useEffect(() => {
    if (!phoneNumber && !email) {
      navigate('/login-options');
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [phoneNumber, email, navigate]);

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      toast.error('Please enter a valid 6-digit code');
      return;
    }

    setIsVerifying(true);

    try {
      let result;
      
      if (phoneNumber) {
        // Phone verification
        result = await supabase.auth.verifyOtp({
          phone: phoneNumber,
          token: otp,
          type: 'sms'
        });
      } else if (email) {
        // Email verification
        result = await supabase.auth.verifyOtp({
          email: email,
          token: otp,
          type: 'email'
        });
      }

      if (result?.error) throw result.error;

      toast.success('Successfully verified!');
      navigate('/');
    } catch (error: any) {
      console.error('OTP verification error:', error);
      toast.error(error.message || 'Invalid verification code');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    setIsResending(true);

    try {
      if (phoneNumber) {
        const { error } = await supabase.auth.signInWithOtp({
          phone: phoneNumber,
          options: {
            channel: method === 'whatsapp' ? 'whatsapp' : 'sms'
          }
        });
        if (error) throw error;
      } else if (email) {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: `${window.location.origin}/`
          }
        });
        if (error) throw error;
      }

      toast.success('Verification code sent!');
      setCountdown(60);
    } catch (error: any) {
      console.error('Resend error:', error);
      toast.error('Failed to resend code');
    } finally {
      setIsResending(false);
    }
  };

  const displayContact = phoneNumber || email;
  const isWhatsApp = method === 'whatsapp';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="p-2 -ml-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </div>

        <div className="text-center space-y-4">
          <div className={`w-16 h-16 mx-auto ${isWhatsApp ? 'bg-green-50' : 'bg-blue-50'} rounded-full flex items-center justify-center mb-6`}>
            {isWhatsApp ? (
              <MessageCircle className="w-8 h-8 text-green-600" />
            ) : (
              <Mail className="w-8 h-8 text-blue-600" />
            )}
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Enter Verification Code
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            We sent a 6-digit code to your {isWhatsApp ? 'WhatsApp' : 'email'}
          </p>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {displayContact}
          </p>
        </div>

        {/* OTP Input */}
        <div className="space-y-6">
          <OtpInput
            value={otp}
            onChange={setOtp}
            disabled={isVerifying}
            error=""
          />

          <GradientButton
            onClick={handleVerifyOtp}
            disabled={otp.length !== 6 || isVerifying}
            variant="primary"
            size="lg"
            className="w-full"
            loading={isVerifying}
          >
            Verify Code
          </GradientButton>

          {/* Resend */}
          <div className="text-center">
            {countdown > 0 ? (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Resend code in {countdown}s
              </p>
            ) : (
              <button
                onClick={handleResendOtp}
                disabled={isResending}
                className="text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium"
              >
                {isResending ? 'Sending...' : 'Resend Code'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;
