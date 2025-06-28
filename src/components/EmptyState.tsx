
import React from 'react';
import { Target, Users, Gift, Lightbulb, Heart, Zap } from 'lucide-react';
import { ContextualEmptyState } from '@/components/empty-states/ContextualEmptyState';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  context?: 'baskets' | 'contributions' | 'members' | 'general';
}

export const EmptyState = ({ 
  title, 
  description, 
  actionLabel, 
  onAction, 
  icon,
  context = 'general'
}: EmptyStateProps) => {
  // Context-specific tips and illustrations
  const getContextualContent = () => {
    switch (context) {
      case 'baskets':
        return {
          illustration: (
            <div className="w-24 h-24 rounded-full bg-gradient-purple-pink/20 flex items-center justify-center">
              <Target className="w-12 h-12 text-purple-400" />
            </div>
          ),
          tips: [
            {
              icon: Lightbulb,
              title: "Start Small",
              description: "Begin with a modest goal to build momentum and trust within your group."
            },
            {
              icon: Users,
              title: "Invite Friends",
              description: "Share your basket with trusted friends and family members first."
            },
            {
              icon: Heart,
              title: "Clear Purpose",
              description: "Make sure your basket has a clear, meaningful goal that resonates with contributors."
            }
          ]
        };
      case 'contributions':
        return {
          illustration: (
            <div className="w-24 h-24 rounded-full bg-gradient-teal-blue/20 flex items-center justify-center">
              <Gift className="w-12 h-12 text-teal-400" />
            </div>
          ),
          tips: [
            {
              icon: Zap,
              title: "Start Contributing",
              description: "Make your first contribution to see your impact and build your streak."
            },
            {
              icon: Target,
              title: "Set Goals",
              description: "Set personal monthly contribution goals to stay motivated."
            }
          ]
        };
      case 'members':
        return {
          illustration: (
            <div className="w-24 h-24 rounded-full bg-gradient-purple-pink/20 flex items-center justify-center">
              <Users className="w-12 h-12 text-purple-400" />
            </div>
          ),
          tips: [
            {
              icon: Heart,
              title: "Build Trust",
              description: "Start by inviting close friends and family who share your goals."
            },
            {
              icon: Gift,
              title: "Lead by Example",
              description: "Make the first contribution to show your commitment to the goal."
            }
          ]
        };
      default:
        return {
          illustration: icon ? (
            <div className="w-24 h-24 rounded-full bg-gradient-purple-pink/20 flex items-center justify-center">
              {icon}
            </div>
          ) : null,
          tips: []
        };
    }
  };

  const contextContent = getContextualContent();

  return (
    <ContextualEmptyState
      title={title}
      subtitle={description}
      illustration={contextContent.illustration}
      primaryAction={actionLabel && onAction ? {
        label: actionLabel,
        onClick: onAction
      } : undefined}
      tips={contextContent.tips}
    />
  );
};
