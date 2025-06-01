
import React from 'react';
import { Flame, Camera } from 'lucide-react';

export const QRLoadingState = () => {
  return (
    <div className="text-center px-4 sm:px-6 max-w-sm mx-auto">
      {/* Enhanced loading spinner with flame effect */}
      <div className="relative mb-6">
        <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-white/20 border-t-orange-500 border-r-red-500 rounded-full animate-spin mx-auto" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Camera className="w-6 h-6 sm:w-8 sm:h-8 text-white/80" />
        </div>
      </div>
      
      {/* Enhanced loading message */}
      <div className="space-y-3">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400 animate-bounce" />
          <h3 className="text-white font-semibold text-base sm:text-lg">Igniting Camera</h3>
          <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
        </div>
        
        <p className="text-gray-300 text-sm sm:text-base">
          Requesting camera access...
        </p>
        
        {/* Progress dots */}
        <div className="flex justify-center gap-1 mt-4">
          <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
          <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>
    </div>
  );
};
