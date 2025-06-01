
import React from 'react';
import { Flame } from 'lucide-react';

export const FlameBorder = () => {
  return (
    <div className="relative">
      <div 
        className="w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 border-4 border-transparent relative mx-auto"
        style={{
          background: 'transparent',
          boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.6)'
        }}
      >
        {/* Enhanced corner flames with responsive sizing */}
        <div className="absolute -top-2 sm:-top-3 -left-2 sm:-left-3">
          <Flame className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-orange-500 animate-bounce" style={{ animationDelay: '0s' }} />
        </div>
        <div className="absolute -top-2 sm:-top-3 -right-2 sm:-right-3">
          <Flame className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-red-500 animate-bounce" style={{ animationDelay: '0.2s' }} />
        </div>
        <div className="absolute -bottom-2 sm:-bottom-3 -left-2 sm:-left-3">
          <Flame className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-yellow-500 animate-bounce" style={{ animationDelay: '0.4s' }} />
        </div>
        <div className="absolute -bottom-2 sm:-bottom-3 -right-2 sm:-right-3">
          <Flame className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-red-400 animate-bounce" style={{ animationDelay: '0.6s' }} />
        </div>
        
        {/* Enhanced edge flames with responsive positioning */}
        <div className="absolute top-1/4 -left-3 sm:-left-4">
          <Flame className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-orange-400 animate-pulse" style={{ animationDelay: '0.1s' }} />
        </div>
        <div className="absolute top-1/4 -right-3 sm:-right-4">
          <Flame className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-red-400 animate-pulse" style={{ animationDelay: '0.3s' }} />
        </div>
        <div className="absolute bottom-1/4 -left-3 sm:-left-4">
          <Flame className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-yellow-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
        </div>
        <div className="absolute bottom-1/4 -right-3 sm:-right-4">
          <Flame className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-orange-500 animate-pulse" style={{ animationDelay: '0.7s' }} />
        </div>
        
        {/* Enhanced border flames with responsive sizing */}
        <div className="absolute top-0 left-1/3 -translate-y-1 sm:-translate-y-2">
          <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-red-300 animate-bounce" style={{ animationDelay: '0.9s' }} />
        </div>
        <div className="absolute top-0 right-1/3 -translate-y-1 sm:-translate-y-2">
          <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-orange-300 animate-bounce" style={{ animationDelay: '1.1s' }} />
        </div>
        <div className="absolute bottom-0 left-1/3 translate-y-1 sm:translate-y-2">
          <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300 animate-bounce" style={{ animationDelay: '1.3s' }} />
        </div>
        <div className="absolute bottom-0 right-1/3 translate-y-1 sm:translate-y-2">
          <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-red-300 animate-bounce" style={{ animationDelay: '1.5s' }} />
        </div>
        
        {/* Enhanced gradient corners with responsive sizing */}
        <div className="absolute top-0 left-0 w-6 h-6 sm:w-8 sm:h-8 border-t-4 border-l-4 border-orange-400 rounded-tl-lg" />
        <div className="absolute top-0 right-0 w-6 h-6 sm:w-8 sm:h-8 border-t-4 border-r-4 border-red-400 rounded-tr-lg" />
        <div className="absolute bottom-0 left-0 w-6 h-6 sm:w-8 sm:h-8 border-b-4 border-l-4 border-yellow-400 rounded-bl-lg" />
        <div className="absolute bottom-0 right-0 w-6 h-6 sm:w-8 sm:h-8 border-b-4 border-r-4 border-orange-500 rounded-br-lg" />
        
        {/* Enhanced animated scanning lines with better visibility */}
        <div className="absolute inset-x-0 top-1/2 h-0.5 sm:h-1 bg-gradient-to-r from-transparent via-orange-400 to-transparent animate-pulse" />
        <div className="absolute inset-y-0 left-1/2 w-0.5 sm:w-1 bg-gradient-to-b from-transparent via-red-400 to-transparent animate-pulse" style={{ animationDelay: '0.5s' }} />
        
        {/* Enhanced pulsing flame glow effect */}
        <div className="absolute inset-0 border-2 border-orange-500/40 animate-pulse rounded-xl" style={{ animationDelay: '0.3s' }} />
        <div className="absolute inset-2 border border-red-400/30 animate-pulse rounded-lg" style={{ animationDelay: '0.6s' }} />
        
        {/* Center target indicator */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white/60 rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
};
