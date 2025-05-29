
import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'text' | 'circle';
}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    const baseClasses = "animate-pulse rounded-lg bg-gray-700/50 shimmer";
    
    const variantClasses = {
      default: "h-4 w-full",
      text: "h-4 w-3/4",
      circle: "rounded-full aspect-square"
    };

    return (
      <div
        ref={ref}
        className={cn(baseClasses, variantClasses[variant], className)}
        {...props}
      />
    );
  }
);

Skeleton.displayName = "Skeleton";
