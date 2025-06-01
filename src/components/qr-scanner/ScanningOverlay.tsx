
import React from 'react';
import { Flame } from 'lucide-react';
import { FlameBorder } from './FlameBorder';

interface ScanningOverlayProps {
  isScanning: boolean;
}

export const ScanningOverlay = ({ isScanning }: ScanningOverlayProps) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {/* Darkened background */}
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Animated flame particles around the screen */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top flames */}
        <div className="absolute top-8 left-1/4">
          <Flame className="w-6 h-6 text-orange-500 animate-bounce" style={{ animationDelay: '0s' }} />
        </div>
        <div className="absolute top-12 right-1/3">
          <Flame className="w-5 h-5 text-red-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
        </div>
        <div className="absolute top-20 left-1/2">
          <Flame className="w-4 h-4 text-yellow-500 animate-bounce" style={{ animationDelay: '1s' }} />
        </div>
        
        {/* Side flames */}
        <div className="absolute top-1/3 left-4">
          <Flame className="w-5 h-5 text-orange-400 animate-pulse" style={{ animationDelay: '0.3s' }} />
        </div>
        <div className="absolute top-1/2 right-6">
          <Flame className="w-6 h-6 text-red-500 animate-bounce" style={{ animationDelay: '0.8s' }} />
        </div>
        <div className="absolute bottom-1/3 left-8">
          <Flame className="w-4 h-4 text-yellow-400 animate-pulse" style={{ animationDelay: '1.2s' }} />
        </div>
        
        {/* Bottom flames */}
        <div className="absolute bottom-16 right-1/4">
          <Flame className="w-5 h-5 text-orange-500 animate-bounce" style={{ animationDelay: '0.7s' }} />
        </div>
        <div className="absolute bottom-20 left-1/3">
          <Flame className="w-6 h-6 text-red-400 animate-pulse" style={{ animationDelay: '1.5s' }} />
        </div>
        <div className="absolute bottom-24 right-1/2">
          <Flame className="w-4 h-4 text-yellow-500 animate-bounce" style={{ animationDelay: '0.2s' }} />
        </div>
      </div>
      
      {/* Scan Window with Enhanced Flame Border */}
      <div className="relative">
        <FlameBorder />
        
        {/* Enhanced scanning message with flame icons */}
        <div className="text-center mt-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Flame className="w-5 h-5 text-orange-400 animate-bounce" />
            <Flame className="w-6 h-6 text-red-500 animate-pulse" />
            <Flame className="w-5 h-5 text-yellow-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
          </div>
          <p className="text-white text-sm font-medium">
            {isScanning ? 'Scanning with fire power...' : 'Position QR code in the flame frame'}
          </p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <Flame className="w-4 h-4 text-orange-300 animate-pulse" style={{ animationDelay: '0.5s' }} />
            <span className="text-gray-300 text-xs">Camera ready and blazing</span>
            <Flame className="w-4 h-4 text-red-300 animate-pulse" style={{ animationDelay: '0.8s' }} />
          </div>
        </div>
      </div>
    </div>
  );
};
