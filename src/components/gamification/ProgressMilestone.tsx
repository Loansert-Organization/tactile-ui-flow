
import React, { useEffect, useState } from 'react';
import { Check, Star, Trophy, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Milestone {
  id: string;
  percentage: number;
  title: string;
  description: string;
  icon: 'star' | 'trophy' | 'target';
  achieved: boolean;
}

interface ProgressMilestoneProps {
  currentProgress: number;
  goal: number;
  milestones?: Milestone[];
  showCelebration?: boolean;
  onMilestoneAchieved?: (milestone: Milestone) => void;
}

const iconMap = {
  star: Star,
  trophy: Trophy,
  target: Target
};

export const ProgressMilestone: React.FC<ProgressMilestoneProps> = ({
  currentProgress,
  goal,
  milestones = [
    { id: '1', percentage: 25, title: 'Great Start!', description: '25% funded', icon: 'star', achieved: false },
    { id: '2', percentage: 50, title: 'Halfway There!', description: '50% funded', icon: 'target', achieved: false },
    { id: '3', percentage: 75, title: 'Almost Done!', description: '75% funded', icon: 'trophy', achieved: false },
    { id: '4', percentage: 100, title: 'Goal Achieved!', description: 'Fully funded', icon: 'trophy', achieved: false }
  ],
  showCelebration = true,
  onMilestoneAchieved
}) => {
  const [celebratingMilestone, setCelebratingMilestone] = useState<Milestone | null>(null);
  const progressPercentage = Math.min((currentProgress / goal) * 100, 100);

  useEffect(() => {
    const newlyAchievedMilestone = milestones.find(
      milestone => !milestone.achieved && progressPercentage >= milestone.percentage
    );

    if (newlyAchievedMilestone && showCelebration) {
      setCelebratingMilestone(newlyAchievedMilestone);
      onMilestoneAchieved?.(newlyAchievedMilestone);
      
      setTimeout(() => {
        setCelebratingMilestone(null);
      }, 3000);
    }
  }, [progressPercentage, milestones, showCelebration, onMilestoneAchieved]);

  return (
    <div className="space-y-4">
      {/* Progress Bar with Milestones */}
      <div className="relative">
        <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-teal-blue rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
          </motion.div>
        </div>

        {/* Milestone Markers */}
        <div className="absolute inset-0 flex justify-between items-center px-1">
          {milestones.map((milestone) => {
            const IconComponent = iconMap[milestone.icon];
            const isAchieved = progressPercentage >= milestone.percentage;
            const position = milestone.percentage;

            return (
              <motion.div
                key={milestone.id}
                className="absolute flex flex-col items-center"
                style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: isAchieved ? 1.2 : 1, 
                  opacity: 1 
                }}
                transition={{ delay: 0.5, duration: 0.3 }}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  isAchieved 
                    ? 'bg-gradient-purple-pink text-white border-white' 
                    : 'bg-gray-600 text-gray-400 border-gray-500'
                }`}>
                  {isAchieved ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    <IconComponent className="w-3 h-3" />
                  )}
                </div>
                <div className="text-xs text-gray-400 mt-1 text-center">
                  {milestone.percentage}%
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Celebration Modal */}
      <AnimatePresence>
        {celebratingMilestone && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="glass-strong p-8 text-center max-w-sm mx-auto rounded-xl"
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 10 }}
              transition={{ type: "spring", duration: 0.5 }}
            >
              <motion.div
                className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-purple-pink flex items-center justify-center"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: 2 }}
              >
                {React.createElement(iconMap[celebratingMilestone.icon], {
                  className: "w-10 h-10 text-white"
                })}
              </motion.div>
              
              <h3 className="text-xl font-bold gradient-text mb-2">
                {celebratingMilestone.title}
              </h3>
              <p className="text-gray-400 mb-4">
                {celebratingMilestone.description}
              </p>
              
              {/* Confetti Effect */}
              <div className="absolute inset-0 pointer-events-none">
                {Array.from({ length: 20 }, (_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-gradient-purple-pink rounded-full"
                    initial={{
                      x: '50%',
                      y: '50%',
                      scale: 0
                    }}
                    animate={{
                      x: `${50 + (Math.random() - 0.5) * 200}%`,
                      y: `${50 + (Math.random() - 0.5) * 200}%`,
                      scale: [0, 1, 0],
                      rotate: Math.random() * 360
                    }}
                    transition={{
                      duration: 2,
                      delay: Math.random() * 0.5,
                      ease: "easeOut"
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
