
import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { GradientButton } from '@/components/ui/gradient-button';

interface QRErrorStateProps {
  error: string | null;
  onRetry: () => void;
}

export const QRErrorState = ({ error, onRetry }: QRErrorStateProps) => {
  return (
    <div className="text-center p-6 max-w-sm mx-auto">
      <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
        <AlertCircle className="w-8 h-8 text-red-400" />
      </div>
      <h3 className="text-white font-semibold text-lg mb-2">Camera Access Needed</h3>
      <p className="text-gray-300 text-sm mb-6">
        {error || 'Please allow camera access to scan QR codes'}
      </p>
      <GradientButton onClick={onRetry} className="w-full">
        <RefreshCw className="w-4 h-4 mr-2" />
        Try Again
      </GradientButton>
    </div>
  );
};
