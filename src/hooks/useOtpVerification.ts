
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { verifyOtp, requestWhatsAppOtp } from '@/services/auth';
import { toast } from '@/hooks/use-toast';

export const useOtpVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
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

  return {
    otp,
    setOtp,
    isVerifying,
    isResending,
    error,
    setError,
    isSuccess,
    handleVerifyOTP,
    handleResendOTP,
    whatsappNumber
  };
};
