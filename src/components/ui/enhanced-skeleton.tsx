
import React from 'react';
import { cn } from '@/lib/utils';

interface EnhancedSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'text' | 'circle' | 'card' | 'button' | 'avatar';
  animation?: 'pulse' | 'shimmer' | 'wave';
  lines?: number;
}

export const EnhancedSkeleton = React.forwardRef<HTMLDivElement, EnhancedSkeletonProps>(
  ({ className, variant = 'default', animation = 'shimmer', lines = 1, ...props }, ref) => {
    const baseClasses = "bg-gray-700/50 rounded-lg";
    
    const animationClasses = {
      pulse: "animate-pulse",
      shimmer: "shimmer",
      wave: "animate-pulse"
    };
    
    const variantClasses = {
      default: "h-4 w-full",
      text: "h-4 w-3/4",
      circle: "rounded-full aspect-square w-12 h-12",
      card: "h-48 w-full",
      button: "h-10 w-24",
      avatar: "rounded-full w-10 h-10"
    };

    if (variant === 'text' && lines > 1) {
      return (
        <div className="space-y-2">
          {Array.from({ length: lines }).map((_, index) => (
            <div
              key={index}
              className={cn(
                baseClasses,
                animationClasses[animation],
                variantClasses[variant],
                index === lines - 1 ? "w-1/2" : "w-full",
                className
              )}
              {...props}
            />
          ))}
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          baseClasses,
          animationClasses[animation],
          variantClasses[variant],
          className
        )}
        {...props}
      />
    );
  }
);

EnhancedSkeleton.displayName = "EnhancedSkeleton";

// Preset skeleton components for common use cases
export const BasketCardSkeleton = () => (
  <div className="glass p-6 space-y-4 animate-slide-up">
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3 flex-1">
        <EnhancedSkeleton variant="circle" className="w-12 h-12" />
        <div className="space-y-2 flex-1">
          <EnhancedSkeleton className="h-5 w-2/3" />
          <EnhancedSkeleton className="h-4 w-1/2" />
        </div>
      </div>
    </div>
    <EnhancedSkeleton variant="text" lines={2} />
    <div className="space-y-2">
      <EnhancedSkeleton className="h-2 w-full" />
      <div className="flex justify-between">
        <EnhancedSkeleton className="h-3 w-20" />
        <EnhancedSkeleton className="h-3 w-24" />
      </div>
    </div>
    <div className="flex gap-3">
      <EnhancedSkeleton variant="button" className="flex-1 h-12" />
      <EnhancedSkeleton variant="button" className="flex-1 h-12" />
    </div>
  </div>
);

export const HeaderSkeleton = () => (
  <div className="glass m-2 px-4 py-3">
    <div className="flex items-center justify-between">
      <div className="w-6"></div>
      <EnhancedSkeleton className="h-6 w-24" />
      <div className="flex gap-2">
        <EnhancedSkeleton variant="circle" className="w-8 h-8" />
        <EnhancedSkeleton variant="circle" className="w-8 h-8" />
      </div>
    </div>
  </div>
);
