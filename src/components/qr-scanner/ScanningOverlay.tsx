
import React from 'react';
import { Flame } from 'lucide-react';
import { FlameBorder } from './FlameBorder';

interface ScanningOverlayProps {
  isScanning: boolean;
}

export const ScanningOverlay = ({ isScanning }: ScanningOverlayProps) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center px-4 sm:px-6">
      {/* Enhanced darkened background with responsive opacity */}
      <div className="absolute inset-0 bg-black/50 sm:bg-black/40" />
      
      {/* Responsive animated flame particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top flames - responsive positioning */}
        <div className="absolute top-12 sm:top-16 md:top-20 left-1/4">
          <Flame className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-orange-500 animate-bounce" style={{ animationDelay: '0s' }} />
        </div>
        <div className="absolute top-16 sm:top-20 md:top-24 right-1/3">
          <Flame className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-red-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
        </div>
        <div className="absolute top-20 sm:top-24 md:top-28 left-1/2">
          <Flame className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 animate-bounce" style={{ animationDelay: '1s' }} />
        </div>
        
        {/* Side flames - responsive positioning */}
        <div className="absolute top-1/3 left-2 sm:left-4">
          <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400 animate-pulse" style={{ animationDelay: '0.3s' }} />
        </div>
        <div className="absolute top-1/2 right-3 sm:right-6">
          <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 animate-bounce" style={{ animationDelay: '0.8s' }} />
        </div>
        <div className="absolute bottom-1/3 left-4 sm:left-8">
          <Flame className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 animate-pulse" style={{ animationDelay: '1.2s' }} />
        </div>
        
        {/* Bottom flames - responsive positioning */}
        <div className="absolute bottom-20 sm:bottom-24 md:bottom-28 right-1/4">
          <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 animate-bounce" style={{ animationDelay: '0.7s' }} />
        </div>
        <div className="absolute bottom-24 sm:bottom-28 md:bottom-32 left-1/3">
          <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-red-400 animate-pulse" style={{ animationDelay: '1.5s' }} />
        </div>
      </div>
      
      {/* Enhanced Scan Window with responsive sizing */}
      <div className="relative z-10">
        <FlameBorder />
        
        {/* Enhanced scanning message with responsive text */}
        <div className="text-center mt-6 sm:mt-8 px-4">
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3">
            <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400 animate-bounce" />
            <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-red-500 animate-pulse" />
            <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
          </div>
          
          <p className="text-white text-sm sm:text-base font-medium mb-2">
            {isScanning ? 'Scanning with fire power...' : 'Position QR code in the flame frame'}
          </p>
          
          <div className="flex items-center justify-center gap-2 mt-2">
            <Flame className="w-3 h-3 sm:w-4 sm:h-4 text-orange-300 animate-pulse" style={{ animationDelay: '0.5s' }} />
            <span className="text-gray-300 text-xs sm:text-sm">Camera ready and blazing</span>
            <Flame className="w-3 h-3 sm:w-4 sm:h-4 text-red-300 animate-pulse" style={{ animationDelay: '0.8s' }} />
          </div>
          
          {/* Progress indicator for scanning */}
          {isScanning && (
            <div className="mt-4 w-full max-w-48 mx-auto">
              <div className="h-1 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-orange-400 via-red-500 to-yellow-400 rounded-full animate-pulse" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
