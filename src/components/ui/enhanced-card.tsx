
import React from 'react';
import { cn } from '@/lib/utils';

interface EnhancedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outline' | 'glass' | 'gradient';
  interactive?: boolean;
  glow?: 'primary' | 'accent' | 'none';
}

export const EnhancedCard = React.forwardRef<HTMLDivElement, EnhancedCardProps>(
  ({ className, variant = 'default', interactive = false, glow = 'none', children, ...props }, ref) => {
    const baseClasses = "rounded-2xl overflow-hidden transition-all duration-300 will-change-transform";
    
    const variantClasses = {
      default: "bg-card text-card-foreground shadow-sm border border-border",
      elevated: "bg-card text-card-foreground shadow-xl border border-border",
      outline: "bg-transparent border-2 border-border hover:border-primary",
      glass: "backdrop-blur-xl bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 shadow-glass",
      gradient: "bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5 border border-primary/20 shadow-lg"
    };
    
    const interactiveClasses = interactive 
      ? "hover:scale-[1.02] active:scale-[0.98] cursor-pointer hover:-translate-y-1 hover:shadow-2xl" 
      : "";
    
    const glowClasses = {
      primary: interactive ? "hover:shadow-glow" : "",
      accent: interactive ? "hover:shadow-glow-accent" : "",
      none: ""
    };
    
    return (
      <div
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          interactiveClasses,
          glowClasses[glow],
          "sm:rounded-3xl", // Larger radius on bigger screens
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
