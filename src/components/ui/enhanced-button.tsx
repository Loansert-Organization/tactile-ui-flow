
import React from 'react';
import { cn } from '@/lib/utils';

interface EnhancedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'glass' | 'gradient-primary' | 'gradient-accent';
  size?: 'sm' | 'md' | 'lg' | 'icon' | 'fab';
  loading?: boolean;
  glow?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

export const EnhancedButton = React.forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  ({ 
    className, 
    children, 
    variant = 'primary', 
    size = 'md', 
    loading = false, 
    glow = false,
    icon,
    iconPosition = 'left',
    fullWidth = false,
    onClick,
    ...props 
  }, ref) => {
    
    const baseClasses = "relative inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background touch-manipulation active:scale-95 will-change-transform";
    
    const variantClasses = {
      primary: "bg-primary text-primary-foreground shadow-md hover:bg-primary/90 hover:shadow-lg",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm",
      outline: "border-2 border-input bg-transparent hover:bg-accent hover:text-accent-foreground hover:border-accent",
      ghost: "hover:bg-muted/50 hover:text-accent-foreground",
      destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-md",
      glass: "backdrop-blur-xl bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 text-foreground hover:bg-white/20 dark:hover:bg-white/10 shadow-glass",
      'gradient-primary': "bg-gradient-to-r from-[#0053B8] to-[#8F00FF] text-white shadow-lg hover:shadow-glow hover:brightness-110",
      'gradient-accent': "bg-gradient-to-r from-[#FFB200] to-[#FF6C00] text-white shadow-lg hover:shadow-glow-accent hover:brightness-110"
    };
    
    const sizeClasses = {
      sm: "text-sm px-4 h-10 py-2 min-w-[2.5rem]",
      md: "text-base px-6 h-12 py-3 min-w-[3rem]",
      lg: "text-lg px-8 h-14 py-4 min-w-[3.5rem]",
      icon: "h-12 w-12 p-0 min-w-[3rem]",
      fab: "h-16 w-16 rounded-full p-0 shadow-xl hover:shadow-2xl min-w-[4rem]",
    };
    
    const glowClasses = glow ? "animate-pulse-glow" : "";
    
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      // Add haptic feedback for mobile devices
      if ('vibrate' in navigator) {
        navigator.vibrate(10);
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
          fullWidth ? "w-full" : "",
          "sm:rounded-2xl", // Larger radius on bigger screens
          className
        )}
        onClick={handleClick}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-inherit rounded-xl">
            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        
        {icon && iconPosition === 'left' && !loading && (
          <span className="shrink-0 flex items-center">{icon}</span>
        )}
        
        <span className={cn(loading ? "invisible" : "", "flex items-center justify-center")}>
          {children}
        </span>
        
        {icon && iconPosition === 'right' && !loading && (
          <span className="shrink-0 flex items-center">{icon}</span>
        )}
        
        {/* Shimmer effect for gradient buttons */}
        {(variant === 'gradient-primary' || variant === 'gradient-accent') && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full hover:translate-x-full transition-transform duration-700 rounded-xl" />
        )}
      </button>
    );
  }
);

EnhancedButton.displayName = "EnhancedButton";
