
import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'strong' | 'subtle' | 'glow';
  hover?: boolean;
  interactive?: boolean;
  glow?: 'primary' | 'accent' | 'none';
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = 'default', hover = false, interactive = false, glow = 'none', children, ...props }, ref) => {
    const baseClasses = "rounded-2xl border backdrop-blur-xl transition-all duration-300 will-change-transform";
    
    const variantClasses = {
      default: "bg-white/10 dark:bg-white/5 border-white/20 dark:border-white/10 shadow-glass",
      strong: "bg-white/15 dark:bg-white/10 border-white/30 dark:border-white/20 shadow-glass shadow-2xl backdrop-blur-2xl",
      subtle: "bg-white/5 dark:bg-white/3 border-white/10 dark:border-white/5 shadow-lg backdrop-blur-md",
      glow: "bg-white/15 dark:bg-white/10 border-white/30 dark:border-white/20 shadow-glass shadow-glow backdrop-blur-xl"
    };

    const hoverClasses = hover ? "hover:bg-white/20 dark:hover:bg-white/15 hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1" : "";
    
    const interactiveClasses = interactive ? "cursor-pointer active:scale-[0.98] touch-target" : "";
    
    const glowClasses = {
      primary: "hover:shadow-glow",
      accent: "hover:shadow-glow-accent", 
      none: ""
    };

    return (
      <div
        ref={ref}
        className={cn(
          baseClasses, 
          variantClasses[variant], 
          hoverClasses, 
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

GlassCard.displayName = "GlassCard";
