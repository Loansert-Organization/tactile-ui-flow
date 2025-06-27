
import React, { useState, useEffect } from 'react';
import { ArrowLeft, MessageCircle, CheckCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { CountdownTimer } from '@/components/auth/CountdownTimer';
import { toast } from '@/hooks/use-toast';
import { verifyOtp, requestOtp } from '@/services/auth';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';

export const Otp = () => {
  const navigate = useNavigate();
  const location = useLocation();
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
      
      // Login user
      login(authResponse.user, {
        accessToken: authResponse.accessToken,
        refreshToken: authResponse.refreshToken
      });
      
      toast({
        title: "Login Successful!",
        description: "Welcome to IKANISA",
      });
      
      // Redirect after success animation
      setTimeout(() => {
        navigate('/');
      }, 2000);
      
    } catch (err) {
      setError('Invalid or expired OTP code');
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

  // Auto-verify when OTP is complete
  useEffect(() => {
    if (otp.length === 6 && !isVerifying) {
      handleVerifyOTP(otp);
    }
  }, [otp, isVerifying]);

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center"
        >
          <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-green-800 mb-2">Welcome!</h2>
          <p className="text-green-600">Redirecting to your dashboard...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8 pt-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/auth/whatsapp', { state: location.state })}
            className="p-2 hover:bg-white/50"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-800">Enter Code</h1>
        </div>

        {/* OTP Card */}
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <MessageCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-xl">Enter Verification Code</CardTitle>
            <p className="text-muted-foreground mt-2">
              {fallback 
                ? "We sent a 6-digit code to your phone via SMS"
                : "We sent a 6-digit code to your WhatsApp"
              }
            </p>
            <p className="text-sm font-medium text-green-600">
              {phone}
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
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
              <p className="text-sm text-destructive text-center">{error}</p>
            )}

            {/* Verify Button */}
            <Button
              onClick={() => handleVerifyOTP(otp)}
              disabled={otp.length !== 6 || isVerifying}
              className="w-full bg-green-600 hover:bg-green-700"
              size="lg"
            >
              {isVerifying ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verifying...
                </div>
              ) : (
                'Verify & Continue'
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
