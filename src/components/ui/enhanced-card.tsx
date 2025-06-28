
import React from 'react';
import { cn } from '@/lib/utils';

interface EnhancedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outline' | 'glass' | 'gradient';
  interactive?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const EnhancedCard = React.forwardRef<HTMLDivElement, EnhancedCardProps>(
  ({ className, variant = 'default', interactive = false, size = 'md', children, ...props }, ref) => {
    const baseClasses = "rounded-2xl overflow-hidden transition-all duration-300 will-change-transform";
    
    const variantClasses = {
      default: "bg-card text-card-foreground shadow-md",
      elevated: "bg-card text-card-foreground shadow-lg hover:shadow-xl",
      outline: "bg-transparent border border-border",
      glass: "backdrop-blur-md bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 shadow-glass-md hover:bg-white/15 dark:hover:bg-white/8 hover:shadow-glass-lg",
      gradient: "bg-gradient-card border border-white/20 dark:border-white/10 shadow-glass-lg"
    };

    const sizeClasses = {
      sm: "p-3 sm:p-4",
      md: "p-4 sm:p-6",
      lg: "p-6 sm:p-8",
      xl: "p-8 sm:p-10"
    };
    
    const interactiveClasses = interactive 
      ? "hover:scale-[1.02] active:scale-[0.98] cursor-pointer touch-manipulation" 
      : "";
    
    return (
      <div
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
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
