
import React, { useState, useEffect } from 'react';
import { ArrowLeft, MessageCircle, RefreshCw } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { toast } from '@/hooks/use-toast';

export const WhatsAppOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const phoneNumber = location.state?.phoneNumber || '';
  
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [countdown, setCountdown] = useState(60);

  // Countdown timer for resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the complete 6-digit code",
        variant: "destructive"
      });
      return;
    }

    setIsVerifying(true);
    
    // Simulate OTP verification
    setTimeout(() => {
      setIsVerifying(false);
      if (otp === '123456') { // Mock successful OTP
        toast({
          title: "Login Successful!",
          description: "Welcome to IKANISA",
        });
        navigate('/');
      } else {
        toast({
          title: "Invalid OTP",
          description: "Please check your WhatsApp and try again",
          variant: "destructive"
        });
        setOtp('');
      }
    }, 2000);
  };

  const handleResendOTP = () => {
    setCountdown(60);
    setCanResend(false);
    toast({
      title: "OTP Resent",
      description: "A new verification code has been sent to your WhatsApp",
    });
  };

  // Auto-verify when OTP is complete
  useEffect(() => {
    if (otp.length === 6) {
      handleVerifyOTP();
    }
  }, [otp]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8 pt-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/whatsapp-login')}
            className="p-2 hover:bg-white/50"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-800">Verify OTP</h1>
        </div>

        {/* OTP Card */}
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <MessageCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-xl">Enter Verification Code</CardTitle>
            <p className="text-muted-foreground mt-2">
              We sent a 6-digit code to your WhatsApp
            </p>
            <p className="text-sm font-medium text-green-600">
              +250 {phoneNumber}
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* OTP Input */}
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => setOtp(value)}
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

            {/* Verify Button */}
            <Button
              onClick={handleVerifyOTP}
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
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Didn't receive the code?
              </p>
              <Button
                variant="ghost"
                onClick={handleResendOTP}
                disabled={!canResend}
                className="text-green-600 hover:text-green-700"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                {canResend ? 'Resend OTP' : `Resend in ${countdown}s`}
              </Button>
            </div>

            {/* Demo Note */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-xs text-yellow-800">
                <strong>Demo:</strong> Use code <code className="bg-yellow-100 px-1 rounded">123456</code> to login
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
