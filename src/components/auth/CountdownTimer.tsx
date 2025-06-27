
import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CountdownTimerProps {
  initialSeconds: number;
  onResend: () => void;
  isResending?: boolean;
}

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  initialSeconds,
  onResend,
  isResending = false
}) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (seconds > 0) {
      const timer = setTimeout(() => setSeconds(seconds - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [seconds]);

  const handleResend = () => {
    setSeconds(initialSeconds);
    setCanResend(false);
    onResend();
  };

  return (
    <div className="text-center space-y-2">
      <p className="text-sm text-muted-foreground">
        Didn't receive the code?
      </p>
      <Button
        variant="ghost"
        onClick={handleResend}
        disabled={!canResend || isResending}
        className="text-green-600 hover:text-green-700"
      >
        <RefreshCw className={cn(
          "w-4 h-4 mr-2",
          isResending && "animate-spin"
        )} />
        {canResend ? 'Resend OTP' : `Resend in ${seconds}s`}
      </Button>
    </div>
  );
};
