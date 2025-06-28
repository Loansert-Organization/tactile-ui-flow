
import React from 'react';
import { cn } from '@/lib/utils';
import { usePressFeedback } from '@/hooks/useInteractions';

interface FABProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'gradient' | 'glass';
  size?: 'sm' | 'md' | 'lg';
  icon: React.ReactNode;
  label?: string;
  expanded?: boolean;
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
    onClick,
    ...props 
  }, ref) => {
    const { handlePress } = usePressFeedback();
    
    const variantClasses = {
      primary: "bg-gradient-primary text-white shadow-glass-lg",
      secondary: "bg-gradient-accent text-white shadow-glass-lg",
      gradient: "bg-gradient-hero text-white shadow-glass-xl",
      glass: "backdrop-blur-md bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 text-foreground shadow-glass-md hover:bg-white/15 dark:hover:bg-white/8",
    };
    
    const sizeClasses = {
      sm: "h-12 w-12 text-sm",
      md: "h-14 w-14 text-base",
      lg: "h-16 w-16 text-lg",
    };
    
    const expandedClasses = expanded ? "pl-4 pr-5 flex items-center gap-3 w-auto" : "";
    
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      handlePress(event);
      if (onClick) onClick(event);
    };
    
    return (
      <button
        ref={ref}
        className={cn(
          "fixed bottom-20 right-4 z-50 rounded-full transition-all duration-300 active:scale-95 overflow-hidden flex items-center justify-center touch-manipulation",
          variantClasses[variant],
          sizeClasses[size],
          expandedClasses,
          className
        )}
        onClick={handleClick}
        aria-label={label || "Action button"}
        {...props}
      >
        {/* Glass shine effect */}
        {(variant === 'gradient' || variant === 'glass') && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        )}
        
        <span className="flex-shrink-0 relative z-10">{icon}</span>
        
        {expanded && label && (
          <span className="font-medium ml-1 relative z-10">{label}</span>
        )}
      </button>
    );
  }
);

FAB.displayName = "FAB";
