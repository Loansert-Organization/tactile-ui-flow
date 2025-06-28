
import React from 'react';
import { cn } from '@/lib/utils';
import { usePressFeedback } from '@/hooks/useInteractions';

interface EnhancedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link' | 'gradient' | 'glass';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'icon' | 'fab';
  loading?: boolean;
  ripple?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  responsive?: boolean;
}

export const EnhancedButton = React.forwardRef<HTMLButtonElement, EnhancedButtonProps>(
  ({ 
    className, 
    children, 
    variant = 'primary', 
    size = 'md', 
    loading = false, 
    ripple = true,
    icon,
    iconPosition = 'left',
    fullWidth = false,
    responsive = true,
    onClick,
    ...props 
  }, ref) => {
    const { handlePress } = usePressFeedback();
    
    const baseClasses = "relative inline-flex items-center justify-center gap-2 font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 touch-manipulation active:scale-95 will-change-transform overflow-hidden";
    
    const variantClasses = {
      primary: "bg-primary text-primary-foreground shadow-md hover:bg-primary/90 hover:shadow-lg",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm",
      outline: "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground shadow-sm",
      ghost: "hover:bg-muted/50 hover:text-accent-foreground",
      destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-md",
      link: "text-primary underline-offset-4 hover:underline",
      gradient: "bg-gradient-to-r from-accent to-orange-500 text-white shadow-lg hover:brightness-110 hover:shadow-xl hover:scale-105",
      glass: "backdrop-blur-md bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 text-foreground shadow-glass-md hover:bg-white/15 dark:hover:bg-white/8 hover:shadow-glass-lg hover:scale-105",
    };
    
    const sizeClasses = responsive ? {
      sm: "text-sm px-3 h-9 py-1 rounded-lg sm:px-4 sm:h-10",
      md: "text-sm px-4 h-11 py-2 rounded-xl sm:text-base sm:px-6 sm:h-12",
      lg: "text-base px-6 h-12 py-2.5 rounded-xl sm:text-lg sm:px-8 sm:h-14",
      xl: "text-lg px-8 h-14 py-3 rounded-2xl sm:text-xl sm:px-10 sm:h-16",
      icon: "h-11 w-11 p-0 rounded-xl sm:h-12 sm:w-12",
      fab: "h-14 w-14 rounded-full p-0 shadow-lg sm:h-16 sm:w-16",
    } : {
      sm: "text-sm px-3 h-9 py-1 rounded-lg",
      md: "text-sm px-4 h-11 py-2 rounded-xl",
      lg: "text-base px-6 h-12 py-2.5 rounded-xl",
      xl: "text-lg px-8 h-14 py-3 rounded-2xl",
      icon: "h-11 w-11 p-0 rounded-xl",
      fab: "h-14 w-14 rounded-full p-0 shadow-lg",
    };
    
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (ripple) {
        handlePress(event);
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
          fullWidth ? "w-full" : "",
          className
        )}
        onClick={handleClick}
        disabled={loading || props.disabled}
        {...props}
      >
        {/* Glass shine effect for gradient and glass variants */}
        {(variant === 'gradient' || variant === 'glass') && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        )}
        
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-inherit rounded-inherit">
            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        
        {icon && iconPosition === 'left' && !loading && (
          <span className="shrink-0">{icon}</span>
        )}
        
        <span className={cn(loading ? "invisible" : "", "relative z-10")}>
          {children}
        </span>
        
        {icon && iconPosition === 'right' && !loading && (
          <span className="shrink-0">{icon}</span>
        )}
      </button>
    );
  }
);

EnhancedButton.displayName = "EnhancedButton";
