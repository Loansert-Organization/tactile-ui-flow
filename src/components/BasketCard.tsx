
import React, { useState } from 'react';
import { Lock, Users, Target } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { GradientButton } from '@/components/ui/gradient-button';
import { usePressFeedback } from '@/hooks/useInteractions';
import { toast } from '@/hooks/use-toast';

interface BasketCardProps {
  id: string;
  name: string;
  description: string;
  isPrivate?: boolean;
  progress: number;
  goal?: number;
  currentAmount?: number;
  participants?: number;
}

export const BasketCard = ({ 
  id, 
  name, 
  description, 
  isPrivate = false, 
  progress,
  goal,
  currentAmount,
  participants = 0
}: BasketCardProps) => {
  const [isJoining, setIsJoining] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const { handlePress } = usePressFeedback();

  const handleJoin = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPrivate || hasJoined) return;

    setIsJoining(true);
    
    // Simulate joining process
    setTimeout(() => {
      setIsJoining(false);
      setHasJoined(true);
      toast({
        title: "Joined!",
        description: `You've successfully joined ${name}`,
      });
    }, 1500);
  };

  return (
    <GlassCard 
      hover 
      className="p-6 space-y-4 cursor-pointer group"
      onClick={(e) => handlePress(e)}
      role="article"
      aria-label={`Basket: ${name}`}
      tabIndex={0}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-purple-pink flex items-center justify-center">
            <span className="text-xl font-bold text-white">
              {name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-fluid-base group-hover:gradient-text transition-all duration-300">
              {name}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Users className="w-4 h-4" />
              <span>{participants} members</span>
              {isPrivate && (
                <>
                  <Lock className="w-4 h-4 ml-2" />
                  <span>Private</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-300 text-sm leading-relaxed">{description}</p>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Progress</span>
          <span className="font-semibold gradient-text-blue">{progress}%</span>
        </div>
        
        <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="absolute inset-y-0 left-0 bg-gradient-teal-blue rounded-full transition-all duration-700 ease-out"
            style={{ width: `${Math.min(progress, 100)}%` }}
          >
            {/* Liquid animation effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
          </div>
        </div>

        {goal && currentAmount && (
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>RWF {currentAmount.toLocaleString()}</span>
            <div className="flex items-center gap-1">
              <Target className="w-3 h-3" />
              <span>RWF {goal.toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="pt-2">
        {isPrivate ? (
          <div className="flex items-center justify-center gap-2 text-gray-500 text-sm py-3">
            <Lock className="w-4 h-4" />
            <span>Private Basket</span>
          </div>
        ) : (
          <GradientButton
            variant="primary"
            size="md"
            className="w-full"
            onClick={handleJoin}
            loading={isJoining}
            disabled={hasJoined}
          >
            {hasJoined ? 'Joined ✓' : 'Join Basket'}
          </GradientButton>
        )}
      </div>
    </GlassCard>
  );
};
