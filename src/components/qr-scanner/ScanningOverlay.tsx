
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
      
      {/* Scan Window with Flame Border */}
      <div className="relative">
        <FlameBorder />
        
        <p className="text-white text-center mt-6 text-sm flex items-center justify-center gap-2">
          <Flame className="w-4 h-4 text-orange-400" />
          {isScanning ? 'Scanning for QR codes...' : 'Position QR code in the flame frame'}
          <Flame className="w-4 h-4 text-red-400" />
        </p>
      </div>
    </div>
  );
};
