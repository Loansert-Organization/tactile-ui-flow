
import React from 'react';
import { cn } from '@/lib/utils';
import { usePressFeedback } from '@/hooks/useInteractions';

interface GradientButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'glass';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  fullWidth?: boolean;
}

export const GradientButton = React.forwardRef<HTMLButtonElement, GradientButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    loading = false, 
    fullWidth = false,
    children, 
    onClick, 
    ...props 
  }, ref) => {
    const { handlePress } = usePressFeedback();
    
    const baseClasses = "relative overflow-hidden font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation active:scale-95 will-change-transform";
    
    const variantClasses = {
      primary: "bg-gradient-primary text-white shadow-glass-lg hover:shadow-glass-xl hover:brightness-110",
      secondary: "bg-gradient-accent text-white shadow-glass-lg hover:shadow-glass-xl hover:brightness-110",
      accent: "bg-gradient-vivid text-white shadow-glass-lg hover:shadow-glass-xl hover:brightness-110",
      glass: "backdrop-blur-md bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 text-foreground shadow-glass-md hover:bg-white/15 dark:hover:bg-white/8 hover:shadow-glass-lg"
    };
    
    const sizeClasses = {
      sm: "px-3 h-9 py-1 text-sm rounded-lg sm:px-4 sm:h-10",
      md: "px-4 h-11 py-2 text-sm rounded-xl sm:px-6 sm:h-12 sm:text-base",
      lg: "px-6 h-12 py-2.5 text-base rounded-xl sm:px-8 sm:h-14 sm:text-lg",
      xl: "px-8 h-14 py-3 text-lg rounded-2xl sm:px-10 sm:h-16 sm:text-xl"
    };
    
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      if (loading) return;
      
      if (handlePress) {
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
        {/* Glass shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full hover:translate-x-full transition-transform duration-700" />
        
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-inherit rounded-inherit">
            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        
        <span className={cn(loading ? "invisible" : "", "relative z-10 flex items-center justify-center gap-2")}>
          {children}
        </span>
      </button>
    );
  }
);

GradientButton.displayName = "GradientButton";
