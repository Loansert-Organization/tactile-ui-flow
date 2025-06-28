
import React from 'react';
import { cn } from '@/lib/utils';

interface FABProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  icon: React.ReactNode;
  label?: string;
  expanded?: boolean;
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center';
  glow?: boolean;
}

export const FAB = React.forwardRef<HTMLButtonElement, FABProps>(
  ({ 
    className, 
    children, 
    variant = 'primary', 
    size = 'md', 
    icon,
    label,
    expanded = false,
    position = 'bottom-right',
    glow = false,
    onClick,
    ...props 
  }, ref) => {
    
    const variantClasses = {
      primary: "bg-gradient-to-r from-[#0053B8] to-[#8F00FF] text-white shadow-xl hover:shadow-glow",
      secondary: "bg-gradient-to-r from-[#06ffa5] to-[#0099ff] text-white shadow-xl hover:shadow-glow",
      accent: "bg-gradient-to-r from-[#FFB200] to-[#FF6C00] text-white shadow-xl hover:shadow-glow-accent",
      glass: "backdrop-blur-xl bg-white/15 dark:bg-white/10 border border-white/30 dark:border-white/20 text-foreground shadow-glass hover:bg-white/25 dark:hover:bg-white/15"
    };
    
    const sizeClasses = {
      sm: "h-12 w-12 text-sm",
      md: "h-16 w-16 text-base",
      lg: "h-20 w-20 text-lg",
    };
    
    const positionClasses = {
      'bottom-right': "bottom-6 right-6",
      'bottom-left': "bottom-6 left-6", 
      'bottom-center': "bottom-6 left-1/2 transform -translate-x-1/2"
    };
    
    const expandedClasses = expanded ? "pl-6 pr-8 flex items-center gap-4 w-auto rounded-full" : "rounded-full";
    
    const glowClasses = glow ? "animate-float" : "";
    
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      // Add haptic feedback for mobile devices
      if ('vibrate' in navigator) {
        navigator.vibrate(15);
      }
      
      if (onClick) onClick(event);
    };
    
    return (
      <button
        ref={ref}
        className={cn(
          "fixed z-50 transition-all duration-300 active:scale-90 hover:scale-105 will-change-transform focus:outline-none focus:ring-4 focus:ring-primary/20 touch-target flex items-center justify-center",
          variantClasses[variant],
          sizeClasses[size],
          positionClasses[position],
          expandedClasses,
          glowClasses,
          "safe-area-bottom", // Handle safe area
          className
        )}
        onClick={handleClick}
        aria-label={label || "Floating action button"}
        {...props}
      >
        <span className="flex-shrink-0 flex items-center justify-center">{icon}</span>
        
        {expanded && label && (
          <span className="font-semibold whitespace-nowrap text-sm sm:text-base">{label}</span>
        )}
        
        {/* Shimmer effect for gradient variants */}
        {variant !== 'glass' && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full hover:translate-x-full transition-transform duration-700 rounded-full" />
        )}
      </button>
    );
  }
);

FAB.displayName = "FAB";
