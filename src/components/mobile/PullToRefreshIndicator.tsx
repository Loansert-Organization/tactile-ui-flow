
import React from 'react';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PullToRefreshIndicatorProps {
  pullDistance: number;
  threshold: number;
  isRefreshing: boolean;
  isAtThreshold: boolean;
}

export const PullToRefreshIndicator = ({ 
  pullDistance, 
  threshold, 
  isRefreshing, 
  isAtThreshold 
}: PullToRefreshIndicatorProps) => {
  const progress = Math.min(pullDistance / threshold, 1);
  const rotation = progress * 180;

  if (pullDistance === 0 && !isRefreshing) return null;

  return (
    <div 
      className="absolute top-0 left-0 right-0 flex justify-center z-10 transition-all duration-300"
      style={{ 
        transform: `translateY(${Math.min(pullDistance - 60, 20)}px)`,
        opacity: Math.min(progress, 1)
      }}
    >
      <div className={cn(
        "flex items-center justify-center w-12 h-12 rounded-full backdrop-blur-lg transition-all duration-300",
        isAtThreshold 
          ? "bg-green-500/20 border-2 border-green-400" 
          : "bg-white/10 border-2 border-white/20"
      )}>
        <RefreshCw 
          className={cn(
            "w-6 h-6 transition-all duration-300",
            isRefreshing 
              ? "animate-spin text-green-400" 
              : isAtThreshold 
                ? "text-green-400"
                : "text-white"
          )}
          style={{ 
            transform: isRefreshing ? 'none' : `rotate(${rotation}deg)` 
          }}
        />
      </div>
    </div>
  );
};
