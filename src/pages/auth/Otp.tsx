
import React, { useState, useEffect } from 'react';
import { ArrowLeft, MessageCircle, CheckCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { CountdownTimer } from '@/components/auth/CountdownTimer';
import { toast } from '@/hooks/use-toast';
import { verifyOtp, requestOtp } from '@/services/auth';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';

export const Otp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { login } = useAuth();
  const { sessionId, phone, expiresIn, fallback } = location.state || {};
  
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
        title: "Login Successful!",
        description: "Welcome to IKANISA",
      });
      
      setTimeout(() => {
        navigate('/');
      }, 2000);
      
    } catch (err) {
      setError(t('auth.invalidCode'));
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
      await requestOtp(phone);
      toast({
        title: "Code Resent",
        description: fallback ? "New SMS sent to your phone" : "Check your WhatsApp for the new code",
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
          <p className="text-green-600">Redirecting to your dashboard...</p>
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
            onClick={() => navigate('/auth/whatsapp', { state: location.state })}
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
                {t('auth.otpTitle')}
              </h1>
              <p className="text-gray-600 mb-2">
                {fallback 
                  ? "We sent a 6-digit code to your phone via SMS"
                  : "We sent a 6-digit code to your WhatsApp"
                }
              </p>
              <p className="text-sm font-medium text-blue-600">
                {phone}
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
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              {isVerifying ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verifying...
                </div>
              ) : (
                t('auth.verifyCode')
              )}
            </Button>

            {/* Resend OTP */}
            <CountdownTimer
              initialSeconds={60}
              onResend={handleResendOTP}
              isResending={isResending}
            />

            {/* Demo Note */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-xs text-yellow-800">
                <strong>Demo:</strong> Use code <code className="bg-yellow-100 px-1 rounded">123456</code> to continue
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
