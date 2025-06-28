
import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'strong' | 'subtle' | 'gradient';
  hover?: boolean;
  interactive?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ 
    className, 
    variant = 'default', 
    hover = false, 
    interactive = false,
    size = 'md',
    children, 
    ...props 
  }, ref) => {
    const baseClasses = "backdrop-blur-md border transition-all duration-300 will-change-transform";
    
    const variantClasses = {
      default: "bg-white/10 dark:bg-white/5 border-white/20 dark:border-white/10 shadow-glass-md",
      strong: "bg-white/15 dark:bg-white/8 border-white/30 dark:border-white/15 shadow-glass-lg backdrop-blur-lg",
      subtle: "bg-white/5 dark:bg-white/3 border-white/10 dark:border-white/5 shadow-glass-sm backdrop-blur-sm",
      gradient: "bg-gradient-card border-white/20 dark:border-white/10 shadow-glass-lg"
    };

    const sizeClasses = {
      sm: "rounded-lg p-3 sm:p-4",
      md: "rounded-xl p-4 sm:p-6",
      lg: "rounded-2xl p-6 sm:p-8",
      xl: "rounded-3xl p-8 sm:p-10"
    };

    const hoverClasses = hover ? "hover:bg-white/20 dark:hover:bg-white/10 hover:shadow-glass-xl hover:scale-[1.02] hover:-translate-y-1" : "";
    const interactiveClasses = interactive ? "cursor-pointer active:scale-[0.98] touch-manipulation" : "";

    return (
      <div
        ref={ref}
        className={cn(
          baseClasses, 
          variantClasses[variant],
          sizeClasses[size], 
          hoverClasses,
          interactiveClasses,
          className
        )}
        {...props}
      >
        {/* Glass shine effect */}
        {hover && (
          <div className="absolute inset-0 rounded-inherit opacity-0 transition-opacity duration-300 group-hover:opacity-100 overflow-hidden">
            <div className="absolute -top-full -left-full w-1/2 h-1/2 bg-gradient-to-br from-white/20 to-transparent transform rotate-45 animate-glass-shine" />
          </div>
        )}
        
        <div className="relative z-10">
          {children}
        </div>
      </div>
    );
  }
);

GlassCard.displayName = "GlassCard";
