import React from 'react';
import { cn } from '@/lib/utils';
import { usePressFeedback } from '@/hooks/useInteractions';
interface GradientButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}
export const GradientButton = React.forwardRef<HTMLButtonElement, GradientButtonProps>(({
  className,
  variant = 'primary',
  size = 'md',
  loading = false,
  children,
  onClick,
  ...props
}, ref) => {
  const {
    handlePress
  } = usePressFeedback();
  const baseClasses = "relative overflow-hidden rounded-xl font-semibold transition-all duration-200 focus-gradient disabled:opacity-50 disabled:cursor-not-allowed";
  const variantClasses = {
    primary: "bg-gradient-magenta-orange text-white shadow-lg hover:shadow-xl",
    secondary: "bg-gradient-teal-blue text-white shadow-lg hover:shadow-xl",
    accent: "bg-gradient-purple-pink text-white shadow-lg hover:shadow-xl"
  };
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    handlePress(event);
    if (onClick) onClick(event);
  };
  return <button ref={ref} className={cn(baseClasses, variantClasses[variant], sizeClasses[size], className)} onClick={handleClick} disabled={loading || props.disabled} {...props}>
        <span className="relative z-10 flex items-center justify-center gap-2 font-extralight text-sm">
          {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
          {children}
        </span>
        
        {/* Gloss effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full hover:translate-x-full transition-transform duration-700" />
      </button>;
});
GradientButton.displayName = "GradientButton";