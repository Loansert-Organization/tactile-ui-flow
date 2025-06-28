
import React from 'react';
import { Crown, Flame, Star, Trophy, Zap, Heart, Target, Gift } from 'lucide-react';
import { motion } from 'framer-motion';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: 'crown' | 'flame' | 'star' | 'trophy' | 'zap' | 'heart' | 'target' | 'gift';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  earned: boolean;
  earnedAt?: Date;
  progress?: number;
  maxProgress?: number;
}

interface BadgeSystemProps {
  badges: Badge[];
  showProgress?: boolean;
  layout?: 'grid' | 'horizontal';
  size?: 'sm' | 'md' | 'lg';
}

const iconMap = {
  crown: Crown,
  flame: Flame,
  star: Star,
  trophy: Trophy,
  zap: Zap,
  heart: Heart,
  target: Target,
  gift: Gift
};

const rarityStyles = {
  common: 'bg-gray-500/20 border-gray-500/50 text-gray-400',
  rare: 'bg-blue-500/20 border-blue-500/50 text-blue-400',
  epic: 'bg-purple-500/20 border-purple-500/50 text-purple-400',
  legendary: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400'
};

const earnedStyles = {
  common: 'bg-gradient-to-br from-gray-400 to-gray-600',
  rare: 'bg-gradient-to-br from-blue-400 to-blue-600',
  epic: 'bg-gradient-to-br from-purple-400 to-purple-600',
  legendary: 'bg-gradient-to-br from-yellow-400 to-yellow-600'
};

export const BadgeSystem: React.FC<BadgeSystemProps> = ({
  badges,
  showProgress = true,
  layout = 'grid',
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const containerClasses = layout === 'grid' 
    ? 'grid grid-cols-4 gap-3'
    : 'flex gap-3 overflow-x-auto pb-2';

  return (
    <div className={containerClasses}>
      {badges.map((badge) => {
        const IconComponent = iconMap[badge.icon];
        const hasProgress = typeof badge.progress === 'number' && typeof badge.maxProgress === 'number';
        const progressPercentage = hasProgress ? (badge.progress! / badge.maxProgress!) * 100 : 0;

        return (
          <motion.div
            key={badge.id}
            className={`relative flex flex-col items-center p-3 rounded-lg border transition-all duration-300 ${
              badge.earned ? earnedStyles[badge.rarity] : rarityStyles[badge.rarity]
            } ${layout === 'horizontal' ? 'flex-shrink-0' : ''}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Badge Icon */}
            <div className={`${sizeClasses[size]} rounded-full flex items-center justify-center mb-2 ${
              badge.earned ? 'text-white' : ''
            }`}>
              <IconComponent className={`${size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-6 h-6' : 'w-8 h-8'}`} />
            </div>

            {/* Badge Name */}
            <div className="text-xs font-semibold text-center truncate w-full">
              {badge.name}
            </div>

            {/* Progress Bar (if applicable) */}
            {showProgress && hasProgress && !badge.earned && (
              <div className="w-full mt-2">
                <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-teal-blue rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <div className="text-xs text-gray-400 mt-1 text-center">
                  {badge.progress}/{badge.maxProgress}
                </div>
              </div>
            )}

            {/* Earned Indicator */}
            {badge.earned && (
              <motion.div
                className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
              >
                <Star className="w-3 h-3 text-white" />
              </motion.div>
            )}

            {/* Tooltip on Hover */}
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-10">
              {badge.description}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
