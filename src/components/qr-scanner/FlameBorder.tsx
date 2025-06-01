
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
        {/* Animated flame corners */}
        <div className="absolute -top-2 -left-2">
          <Flame className="w-8 h-8 text-orange-500 animate-bounce" style={{ animationDelay: '0s' }} />
        </div>
        <div className="absolute -top-2 -right-2">
          <Flame className="w-8 h-8 text-red-500 animate-bounce" style={{ animationDelay: '0.2s' }} />
        </div>
        <div className="absolute -bottom-2 -left-2">
          <Flame className="w-8 h-8 text-yellow-500 animate-bounce" style={{ animationDelay: '0.4s' }} />
        </div>
        <div className="absolute -bottom-2 -right-2">
          <Flame className="w-8 h-8 text-red-400 animate-bounce" style={{ animationDelay: '0.6s' }} />
        </div>
        
        {/* Additional flame decorations on edges */}
        <div className="absolute top-1/4 -left-3">
          <Flame className="w-6 h-6 text-orange-400 animate-pulse" style={{ animationDelay: '0.1s' }} />
        </div>
        <div className="absolute top-1/4 -right-3">
          <Flame className="w-6 h-6 text-red-400 animate-pulse" style={{ animationDelay: '0.3s' }} />
        </div>
        <div className="absolute bottom-1/4 -left-3">
          <Flame className="w-6 h-6 text-yellow-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
        </div>
        <div className="absolute bottom-1/4 -right-3">
          <Flame className="w-6 h-6 text-orange-500 animate-pulse" style={{ animationDelay: '0.7s' }} />
        </div>
        
        {/* Original gradient corners for enhanced effect */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-orange-400" />
        <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-red-400" />
        <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-yellow-400" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-orange-500" />
        
        {/* Flame-colored scanning line */}
        <div className="absolute inset-x-0 top-1/2 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent animate-pulse" />
      </div>
    </div>
  );
};
