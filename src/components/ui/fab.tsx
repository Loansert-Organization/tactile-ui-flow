
import React from 'react';
import { cn } from '@/lib/utils';
import { usePressFeedback } from '@/hooks/useInteractions';

interface FABProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive';
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
      primary: "bg-gradient-magenta-orange text-white",
      secondary: "bg-gradient-teal-blue text-white",
      destructive: "bg-destructive text-destructive-foreground",
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
          "fixed bottom-20 right-4 z-50 rounded-full shadow-lg transition-all duration-300 active:scale-95 overflow-hidden flex items-center justify-center",
          variantClasses[variant],
          sizeClasses[size],
          expandedClasses,
          className
        )}
        onClick={handleClick}
        aria-label={label || "Action button"}
        {...props}
      >
        <span className="flex-shrink-0">{icon}</span>
        
        {expanded && label && (
          <span className="font-medium ml-1">{label}</span>
        )}
      </button>
    );
  }
);

FAB.displayName = "FAB";
