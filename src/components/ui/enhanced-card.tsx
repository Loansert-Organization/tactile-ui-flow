
import React from 'react';
import { cn } from '@/lib/utils';

interface EnhancedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outline' | 'glass';
  interactive?: boolean;
}

export const EnhancedCard = React.forwardRef<HTMLDivElement, EnhancedCardProps>(
  ({ className, variant = 'default', interactive = false, children, ...props }, ref) => {
    const baseClasses = "rounded-2xl overflow-hidden transition-all duration-200";
    
    const variantClasses = {
      default: "bg-card text-card-foreground",
      elevated: "bg-card text-card-foreground shadow-lg",
      outline: "bg-transparent border border-border",
      glass: "bg-card/50 backdrop-blur-md border border-white/10",
    };
    
    const interactiveClasses = interactive 
      ? "hover:scale-[1.02] active:scale-[0.98] cursor-pointer" 
      : "";
    
    return (
      <div
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          interactiveClasses,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

EnhancedCard.displayName = "EnhancedCard";
