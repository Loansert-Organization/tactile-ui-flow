
import React from 'react';
import { cn } from '@/lib/utils';
import { usePressFeedback } from '@/hooks/useInteractions';

interface EnhancedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link';
  size?: 'sm' | 'md' | 'lg' | 'icon' | 'fab';
  loading?: boolean;
  ripple?: boolean;
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
    ripple = true,
    icon,
    iconPosition = 'left',
    fullWidth = false,
    onClick,
    ...props 
  }, ref) => {
    const { handlePress } = usePressFeedback();
    
    const baseClasses = "relative inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 touch-manipulation active:scale-[0.98]";
    
    const variantClasses = {
      primary: "bg-primary text-primary-foreground shadow-md hover:bg-primary/90",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      outline: "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
      ghost: "hover:bg-muted/50 hover:text-accent-foreground",
      destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      link: "text-primary underline-offset-4 hover:underline",
    };
    
    const sizeClasses = {
      sm: "text-xs px-3 h-9 py-1",
      md: "text-sm px-4 h-11 py-2",
      lg: "text-base px-6 h-12 py-2.5",
      icon: "h-11 w-11 p-0",
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
          ripple ? "overflow-hidden" : "", 
          fullWidth ? "w-full" : "",
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
          <span className="shrink-0">{icon}</span>
        )}
        
        <span className={cn(loading ? "invisible" : "")}>
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
