
import React from 'react';
import { cn } from '@/lib/utils';

interface GradientButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  glow?: boolean;
  shimmer?: boolean;
}

export const GradientButton = React.forwardRef<HTMLButtonElement, GradientButtonProps>(
  ({
    className,
    variant = 'primary',
    size = 'md',
    loading = false,
    glow = false,
    shimmer = true,
    children,
    onClick,
    ...props
  }, ref) => {
    
    const baseClasses = "relative overflow-hidden rounded-xl font-semibold transition-all duration-200 focus-gradient disabled:opacity-50 disabled:cursor-not-allowed touch-target active:scale-95 will-change-transform";
    
    const variantClasses = {
      primary: "bg-gradient-to-r from-[#0053B8] to-[#8F00FF] text-white shadow-lg hover:shadow-glow hover:brightness-110",
      secondary: "bg-gradient-to-r from-[#06ffa5] to-[#0099ff] text-white shadow-lg hover:shadow-glow hover:brightness-110",
      accent: "bg-gradient-to-r from-[#FFB200] to-[#FF6C00] text-white shadow-lg hover:shadow-glow-accent hover:brightness-110",
      glass: "backdrop-blur-xl bg-gradient-to-r from-white/15 to-white/10 dark:from-white/10 dark:to-white/5 border border-white/30 dark:border-white/20 text-foreground shadow-glass hover:from-white/25 hover:to-white/15 dark:hover:from-white/15 dark:hover:to-white/10"
    };
    
    const sizeClasses = {
      sm: "px-4 py-2 text-sm h-10 min-w-[2.5rem]",
      md: "px-6 py-3 text-base h-12 min-w-[3rem]",
      lg: "px-8 py-4 text-lg h-14 min-w-[3.5rem]"
    };
    
    const glowClasses = glow ? "animate-pulse-glow" : "";
    
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      // Add haptic feedback for mobile devices
      if ('vibrate' in navigator) {
        navigator.vibrate(12);
      }
      
      if (onClick) onClick(event);
    };
    
    return (
      <button
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          glowClasses,
          "sm:rounded-2xl", // Larger radius on bigger screens
          className
        )}
        onClick={handleClick}
        disabled={loading || props.disabled}
        {...props}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {loading && (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          )}
          {children}
        </span>
        
        {/* Shimmer effect */}
        {shimmer && !loading && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full hover:translate-x-full transition-transform duration-700" />
        )}
      </button>
    );
  }
);

GradientButton.displayName = "GradientButton";
