
import React, { useState, useEffect } from 'react';
import { ArrowLeft, MessageCircle, CheckCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { CountdownTimer } from '@/components/auth/CountdownTimer';
import { toast } from '@/hooks/use-toast';
import { verifyOtp, requestWhatsAppOtp } from '@/services/auth';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';

// Step 1: Simplified OTP verification screen
export const Otp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { login } = useAuth();
  const { sessionId, whatsappNumber, expiresIn } = location.state || {};
  
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!sessionId) {
      navigate('/auth/phone');
    }
  }, [sessionId, navigate]);

  const handleVerifyOTP = async (code: string) => {
    if (code.length !== 6) return;

    setIsVerifying(true);
    setError('');
    
    try {
      const authResponse = await verifyOtp(sessionId, code);
      
      setIsSuccess(true);
      
      login(authResponse.user, {
        accessToken: authResponse.accessToken,
        refreshToken: authResponse.refreshToken
      });
      
      toast({
        title: "Welcome!",
        description: "You're now logged in to IKANISA",
      });
      
      // Step 4: Direct redirect to main app
      setTimeout(() => {
        navigate('/');
      }, 2000);
      
    } catch (err) {
      setError('Invalid verification code');
      toast({
        title: "Verification Failed",
        description: "Please check your code and try again",
        variant: "destructive"
      });
      setOtp('');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    setIsResending(true);
    try {
      await requestWhatsAppOtp(whatsappNumber);
      toast({
        title: "Code Resent",
        description: "Check your WhatsApp for the new verification code",
      });
    } catch (err) {
      toast({
        title: "Resend Failed",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsResending(false);
    }
  };

  useEffect(() => {
    if (otp.length === 6 && !isVerifying) {
      handleVerifyOTP(otp);
    }
  }, [otp, isVerifying]);

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-green-800 mb-2">Welcome!</h2>
          <p className="text-green-600">Taking you to your dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-sm mx-auto">
        {/* Header */}
        <div className="flex items-center mb-12 pt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/auth/phone')}
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
                Enter Verification Code
              </h1>
              <p className="text-gray-600 mb-2">
                We sent a 6-digit code to your WhatsApp
              </p>
              <p className="text-sm font-medium text-green-600">
                {whatsappNumber}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* OTP Input */}
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => {
                  setOtp(value);
                  setError('');
                }}
                disabled={isVerifying}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            {/* Error Message */}
            {error && (
              <p className="text-sm text-red-600 text-center">{error}</p>
            )}

            {/* Verify Button */}
            <Button
              onClick={() => handleVerifyOTP(otp)}
              disabled={otp.length !== 6 || isVerifying}
              className="w-full h-12 bg-green-600 hover:bg-green-700 text-white rounded-lg"
            >
              {isVerifying ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verifying...
                </div>
              ) : (
                'Verify Code'
              )}
            </Button>

            {/* Resend OTP */}
            <CountdownTimer
              initialSeconds={60}
              onResend={handleResendOTP}
              isResending={isResending}
            />

            {/* Demo Note */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-xs text-green-800">
                <strong>Demo:</strong> Use code <code className="bg-green-100 px-1 rounded">123456</code> to continue
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
