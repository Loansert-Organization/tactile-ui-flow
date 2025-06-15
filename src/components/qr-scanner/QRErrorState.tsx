
import React from 'react';
import { AlertCircle, RefreshCw, Flame } from 'lucide-react';
import { GradientButton } from '@/components/ui/gradient-button';

interface QRErrorStateProps {
  error: string | null;
  onRetry: () => void;
  retryText?: string;
  darkMode?: boolean;
}

export const QRErrorState = ({
  error,
  onRetry,
  retryText = "Retry Scan",
  darkMode = false
}: QRErrorStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full px-4 py-12 text-center">
      <div className="relative w-16 h-16 mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
        <AlertCircle className="w-9 h-9 text-red-400" />
        <div className="absolute -top-1 -right-1">
          <Flame className="w-5 h-5 text-orange-400 animate-bounce" />
        </div>
      </div>
      <h3 className={`font-semibold text-lg mb-2 ${darkMode ? "text-[#eee]" : "text-red-700"}`}>
        Camera Issue
      </h3>
      <p className={`mb-6 text-sm font-medium ${darkMode ? "text-[#ccc]" : "text-gray-700"}`}>
        {error || "Unable to detect QR. Try moving closer or using torchlight."}
      </p>
      <GradientButton
        onClick={onRetry}
        variant="primary"
        className="w-full max-w-xs min-h-[48px] rounded-2xl"
      >
        <RefreshCw className="w-5 h-5 mr-2" />
        {retryText}
      </GradientButton>
      <p className="text-xs mt-5 text-gray-400">
        Make sure to allow camera access and hold code steady inside frame.
      </p>
    </div>
  );
}
