
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { GradientButton } from '@/components/ui/gradient-button';

interface TipStep {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface ContextualEmptyStateProps {
  title: string;
  subtitle: string;
  illustration?: React.ReactNode;
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  tips?: TipStep[];
  className?: string;
}

export const ContextualEmptyState: React.FC<ContextualEmptyStateProps> = ({
  title,
  subtitle,
  illustration,
  primaryAction,
  secondaryAction,
  tips = [],
  className = ''
}) => {
  return (
    <motion.div
      className={`flex flex-col items-center justify-center min-h-[400px] p-6 text-center ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Illustration */}
      {illustration && (
        <motion.div
          className="mb-6"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          {illustration}
        </motion.div>
      )}

      {/* Title and Subtitle */}
      <motion.div
        className="mb-6 space-y-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <h3 className="text-xl font-bold gradient-text">{title}</h3>
        <p className="text-gray-400 max-w-md leading-relaxed">{subtitle}</p>
      </motion.div>

      {/* Action Buttons */}
      {(primaryAction || secondaryAction) && (
        <motion.div
          className="flex gap-3 mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          {primaryAction && (
            <GradientButton
              onClick={primaryAction.onClick}
              variant="primary"
              size="md"
            >
              {primaryAction.label}
            </GradientButton>
          )}
          {secondaryAction && (
            <GradientButton
              onClick={secondaryAction.onClick}
              variant="secondary"
              size="md"
            >
              {secondaryAction.label}
            </GradientButton>
          )}
        </motion.div>
      )}

      {/* Tips Section */}
      {tips.length > 0 && (
        <motion.div
          className="w-full max-w-md space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <h4 className="text-sm font-semibold text-gray-300 mb-3">Quick Tips:</h4>
          {tips.map((tip, index) => (
            <motion.div
              key={index}
              className="flex items-start gap-3 p-3 rounded-lg glass-strong"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 + index * 0.1, duration: 0.3 }}
            >
              <div className="w-8 h-8 rounded-full bg-gradient-purple-pink/20 flex items-center justify-center flex-shrink-0">
                <tip.icon className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-left">
                <h5 className="text-sm font-semibold text-white mb-1">{tip.title}</h5>
                <p className="text-xs text-gray-400">{tip.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};
