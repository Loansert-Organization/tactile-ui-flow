
import React from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { GradientButton } from '@/components/ui/gradient-button';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState = ({ title, description, actionLabel, onAction, icon }: EmptyStateProps) => {
  return (
    <div className="flex items-center justify-center min-h-[400px] p-6">
      <GlassCard className="p-8 text-center max-w-md mx-auto">
        {icon && (
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 rounded-full bg-gradient-purple-pink/20 flex items-center justify-center">
              {icon}
            </div>
          </div>
        )}
        
        <h3 className="text-xl font-semibold mb-3 gradient-text truncate">{title}</h3>
        <p className="text-gray-400 mb-6 leading-relaxed line-clamp-3">{description}</p>
        
        {actionLabel && onAction && (
          <GradientButton onClick={onAction} variant="primary">
            <span className="truncate">{actionLabel}</span>
          </GradientButton>
        )}
      </GlassCard>
    </div>
  );
};
