
import { useState } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';

export const useOtpVerification = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthContext();

  // Since we're using anonymous auth only, OTP verification is not needed
  // This hook is kept for compatibility but simplified
  const requestOtp = async (phoneNumber: string) => {
    console.log('OTP verification not needed for anonymous auth');
    return { success: true };
  };

  const verifyOtp = async (otp: string) => {
    console.log('OTP verification not needed for anonymous auth');
    return { success: true };
  };

  return {
    requestOtp,
    verifyOtp,
    isLoading,
    error,
    user
  };
};
