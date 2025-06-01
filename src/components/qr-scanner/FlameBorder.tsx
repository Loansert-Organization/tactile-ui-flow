
import React from 'react';
import { Flame } from 'lucide-react';

export const FlameBorder = () => {
  return (
    <div className="relative">
      <div 
        className="w-64 h-64 border-4 border-transparent relative"
        style={{
          background: 'transparent',
          boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)'
        }}
      >
        {/* Large animated flame corners */}
        <div className="absolute -top-3 -left-3">
          <Flame className="w-10 h-10 text-orange-500 animate-bounce" style={{ animationDelay: '0s' }} />
        </div>
        <div className="absolute -top-3 -right-3">
          <Flame className="w-10 h-10 text-red-500 animate-bounce" style={{ animationDelay: '0.2s' }} />
        </div>
        <div className="absolute -bottom-3 -left-3">
          <Flame className="w-10 h-10 text-yellow-500 animate-bounce" style={{ animationDelay: '0.4s' }} />
        </div>
        <div className="absolute -bottom-3 -right-3">
          <Flame className="w-10 h-10 text-red-400 animate-bounce" style={{ animationDelay: '0.6s' }} />
        </div>
        
        {/* Medium flame decorations on edges */}
        <div className="absolute top-1/4 -left-4">
          <Flame className="w-7 h-7 text-orange-400 animate-pulse" style={{ animationDelay: '0.1s' }} />
        </div>
        <div className="absolute top-1/4 -right-4">
          <Flame className="w-7 h-7 text-red-400 animate-pulse" style={{ animationDelay: '0.3s' }} />
        </div>
        <div className="absolute bottom-1/4 -left-4">
          <Flame className="w-7 h-7 text-yellow-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
        </div>
        <div className="absolute bottom-1/4 -right-4">
          <Flame className="w-7 h-7 text-orange-500 animate-pulse" style={{ animationDelay: '0.7s' }} />
        </div>
        
        {/* Small dancing flames on the border */}
        <div className="absolute top-0 left-1/3 -translate-y-2">
          <Flame className="w-5 h-5 text-red-300 animate-bounce" style={{ animationDelay: '0.9s' }} />
        </div>
        <div className="absolute top-0 right-1/3 -translate-y-2">
          <Flame className="w-5 h-5 text-orange-300 animate-bounce" style={{ animationDelay: '1.1s' }} />
        </div>
        <div className="absolute bottom-0 left-1/3 translate-y-2">
          <Flame className="w-5 h-5 text-yellow-300 animate-bounce" style={{ animationDelay: '1.3s' }} />
        </div>
        <div className="absolute bottom-0 right-1/3 translate-y-2">
          <Flame className="w-5 h-5 text-red-300 animate-bounce" style={{ animationDelay: '1.5s' }} />
        </div>
        
        {/* Gradient corners for enhanced effect */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-orange-400" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-red-400" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-yellow-400" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-orange-500" />
        
        {/* Animated flame-colored scanning lines */}
        <div className="absolute inset-x-0 top-1/2 h-1 bg-gradient-to-r from-transparent via-orange-400 to-transparent animate-pulse" />
        <div className="absolute inset-y-0 left-1/2 w-1 bg-gradient-to-b from-transparent via-red-400 to-transparent animate-pulse" style={{ animationDelay: '0.5s' }} />
        
        {/* Pulsing flame glow effect */}
        <div className="absolute inset-0 border-2 border-orange-500/30 animate-pulse rounded-lg" style={{ animationDelay: '0.3s' }} />
      </div>
    </div>
  );
};
