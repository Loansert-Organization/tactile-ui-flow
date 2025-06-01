
import React from 'react';
import { AlertCircle, RefreshCw, Flame } from 'lucide-react';
import { GradientButton } from '@/components/ui/gradient-button';

interface QRErrorStateProps {
  error: string | null;
  onRetry: () => void;
}

export const QRErrorState = ({ error, onRetry }: QRErrorStateProps) => {
  return (
    <div className="text-center p-4 sm:p-6 max-w-sm mx-auto">
      {/* Enhanced error icon with flame effect */}
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
        <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10 text-red-400" />
        <div className="absolute -top-1 -right-1">
          <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400 animate-bounce" />
        </div>
      </div>
      
      {/* Enhanced error message */}
      <div className="space-y-4">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 animate-pulse" />
          <h3 className="text-white font-semibold text-lg sm:text-xl">Camera Access Needed</h3>
          <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400 animate-pulse" style={{ animationDelay: '0.3s' }} />
        </div>
        
        <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
          {error || 'Please allow camera access to scan QR codes with our flame-powered scanner'}
        </p>
        
        {/* Enhanced retry button */}
        <GradientButton 
          onClick={onRetry} 
          className="w-full mt-6 min-h-[48px] text-base font-medium touch-manipulation"
        >
          <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
          Reignite Camera
        </GradientButton>
        
        {/* Help text */}
        <p className="text-gray-400 text-xs sm:text-sm mt-4">
          Make sure to allow camera permissions in your browser settings
        </p>
      </div>
    </div>
  );
};
