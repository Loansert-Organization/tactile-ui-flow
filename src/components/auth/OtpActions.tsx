
import React from 'react';
import { Button } from '@/components/ui/button';
import { CountdownTimer } from '@/components/auth/CountdownTimer';

interface OtpActionsProps {
  otp: string;
  isVerifying: boolean;
  isResending: boolean;
  onVerifyOtp: () => void;
  onResendOtp: () => void;
}

export const OtpActions: React.FC<OtpActionsProps> = ({
  otp,
  isVerifying,
  isResending,
  onVerifyOtp,
  onResendOtp
}) => {
  return (
    <div className="space-y-6">
      {/* Verify Button */}
      <Button
        onClick={onVerifyOtp}
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
        onResend={onResendOtp}
        isResending={isResending}
      />

      {/* Demo Note */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
        <p className="text-xs text-green-800">
          <strong>Demo:</strong> Use code <code className="bg-green-100 px-1 rounded">123456</code> to continue
        </p>
      </div>
    </div>
  );
};
