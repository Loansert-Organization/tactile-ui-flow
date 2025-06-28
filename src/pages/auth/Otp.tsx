
import React from 'react';
import { OtpHeader } from '@/components/auth/OtpHeader';
import { OtpInput } from '@/components/auth/OtpInput';
import { OtpActions } from '@/components/auth/OtpActions';
import { OtpSuccessScreen } from '@/components/auth/OtpSuccessScreen';
import { useOtpVerification } from '@/hooks/useOtpVerification';

export const Otp = () => {
  const {
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
  } = useOtpVerification();

  if (isSuccess) {
    return <OtpSuccessScreen />;
  }

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-sm mx-auto">
        <OtpHeader whatsappNumber={whatsappNumber} />

        <div className="space-y-8">
          <div className="space-y-6">
            <OtpInput
              value={otp}
              onChange={(value) => {
                setOtp(value);
                setError('');
              }}
              disabled={isVerifying}
              error={error}
            />

            <OtpActions
              otp={otp}
              isVerifying={isVerifying}
              isResending={isResending}
              onVerifyOtp={() => handleVerifyOTP(otp)}
              onResendOtp={handleResendOTP}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
