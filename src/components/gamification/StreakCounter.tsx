
import React from 'react';
import { Flame, Calendar, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

interface StreakCounterProps {
  currentStreak: number;
  longestStreak: number;
  streakType: 'daily' | 'weekly' | 'monthly';
  lastContributionDate?: Date;
  showAnimation?: boolean;
}

export const StreakCounter: React.FC<StreakCounterProps> = ({
  currentStreak,
  longestStreak,
  streakType,
  lastContributionDate,
  showAnimation = true
}) => {
  const isActiveStreak = currentStreak > 0;
  const streakLabels = {
    daily: 'Day',
    weekly: 'Week', 
    monthly: 'Month'
  };

  const getStreakColor = (streak: number) => {
    if (streak >= 30) return 'text-yellow-400';
    if (streak >= 14) return 'text-orange-400';
    if (streak >= 7) return 'text-red-400';
    return 'text-blue-400';
  };

  const getFlameIntensity = (streak: number) => {
    if (streak >= 30) return 'filter drop-shadow-lg';
    if (streak >= 14) return 'filter drop-shadow-md';
    if (streak >= 7) return 'filter drop-shadow-sm';
    return '';
  };

  return (
    <div className="glass p-4 rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <motion.div
            className={`${getFlameIntensity(currentStreak)}`}
            animate={showAnimation && isActiveStreak ? { 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            } : {}}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <Flame className={`w-6 h-6 ${isActiveStreak ? getStreakColor(currentStreak) : 'text-gray-500'}`} />
          </motion.div>
          <h3 className="font-semibold text-lg">Contribution Streak</h3>
        </div>
        {longestStreak > currentStreak && (
          <div className="flex items-center gap-1 text-sm text-gray-400">
            <Trophy className="w-4 h-4" />
            <span>Best: {longestStreak}</span>
          </div>
        )}
      </div>

      <div className="text-center space-y-2">
        <motion.div
          className="text-3xl font-bold gradient-text"
          key={currentStreak}
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {currentStreak}
        </motion.div>
        
        <div className="text-sm text-gray-400">
          {currentStreak === 1 
            ? `${streakLabels[streakType]} Streak` 
            : `${streakLabels[streakType]}s Streak`
          }
        </div>

        {lastContributionDate && (
          <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
            <Calendar className="w-3 h-3" />
            <span>
              Last: {lastContributionDate.toLocaleDateString()}
            </span>
          </div>
        )}
      </div>

      {/* Streak Milestones */}
      <div className="mt-4 flex justify-center gap-2">
        {[7, 14, 30, 100].map((milestone) => (
          <div
            key={milestone}
            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all duration-300 ${
              currentStreak >= milestone
                ? 'bg-gradient-purple-pink text-white border-white'
                : 'border-gray-600 text-gray-500'
            }`}
          >
            {milestone >= 100 ? '💯' : milestone}
          </div>
        ))}
      </div>

      {/* Motivational Message */}
      <div className="mt-3 text-center text-xs text-gray-400">
        {currentStreak === 0 && "Start your streak today!"}
        {currentStreak > 0 && currentStreak < 7 && "Keep it up! You're building momentum."}
        {currentStreak >= 7 && currentStreak < 14 && "Great job! You're on fire! 🔥"}
        {currentStreak >= 14 && currentStreak < 30 && "Amazing streak! You're unstoppable! ⚡"}
        {currentStreak >= 30 && "Legendary contributor! You're an inspiration! 👑"}
      </div>
    </div>
  );
};
