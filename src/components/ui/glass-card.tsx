
import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'strong' | 'subtle';
  hover?: boolean;
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = 'default', hover = false, children, ...props }, ref) => {
    const baseClasses = "rounded-2xl border backdrop-blur-md transition-all duration-300";
    
    const variantClasses = {
      default: "bg-white/10 border-white/20 shadow-xl",
      strong: "bg-white/15 border-white/30 shadow-2xl backdrop-blur-lg",
      subtle: "bg-white/5 border-white/10 shadow-lg backdrop-blur-sm"
    };

    const hoverClasses = hover ? "hover:bg-white/20 hover:shadow-2xl hover:scale-[1.02]" : "";

    return (
      <div
        ref={ref}
        className={cn(baseClasses, variantClasses[variant], hoverClasses, className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassCard.displayName = "GlassCard";
