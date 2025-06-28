import { useState } from 'react';
import { useAuthContext } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export const useOtpVerification = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthContext();

  // Request OTP for WhatsApp verification
  const requestOtp = async (phoneNumber: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone: phoneNumber,
        options: {
          channel: 'whatsapp'
        }
      });
      
      if (error) throw error;
      
      return { success: true };
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Verify OTP code
  const verifyOtp = async (otp: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase.auth.verifyOtp({
        phone: user?.phone || '',
        token: otp,
        type: 'sms'
      });
      
      if (error) throw error;
      
      return { success: true };
    } catch (err: any) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    requestOtp,
    verifyOtp,
    isLoading,
    error,
    user
  };
};
