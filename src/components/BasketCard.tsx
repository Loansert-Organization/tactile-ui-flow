
import React from 'react';
import { Users, Calendar, Target } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { GradientButton } from '@/components/ui/gradient-button';
import { ShareButton } from '@/components/ui/share-button';
import { formatCurrency } from '@/lib/formatters';
import { useNavigate } from 'react-router-dom';
import { useBaskets } from '@/contexts/BasketContext';

interface BasketCardProps {
  id: string;
  name: string;
  description: string;
  goal: number;
  currentAmount: number;
  progress: number;
  participants: number;
  isMember: boolean;
  myContribution: number;
  daysLeft: number;
  isPrivate: boolean;
}

export function BasketCard({
  id,
  name,
  description,
  goal,
  currentAmount,
  progress,
  participants,
  isMember,
  myContribution,
  daysLeft,
  isPrivate
}: BasketCardProps) {
  const navigate = useNavigate();
  const { joinBasket } = useBaskets();
  const basketURL = `${window.location.origin}/basket/${id}`;

  const handleJoin = () => {
    joinBasket(id);
  };

  const handleViewDetails = () => {
    if (isMember) {
      navigate(`/basket/${id}`);
    } else {
      navigate(`/basket/${id}/join`);
    }
  };

  return (
    <GlassCard className="p-6 hover:bg-white/15 transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-semibold gradient-text text-lg mb-2">{name}</h3>
          <p className="text-gray-400 text-sm mb-3">{description}</p>
        </div>
        <ShareButton 
          basketName={name} 
          basketURL={basketURL}
          size="sm"
        />
      </div>

      {/* Progress Section */}
      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-400">Progress</span>
          <span className="font-semibold gradient-text-blue">{progress}%</span>
        </div>
        
        <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="absolute inset-y-0 left-0 bg-gradient-teal-blue rounded-full transition-all duration-700"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">{formatCurrency(currentAmount)}</span>
          <div className="flex items-center gap-1 text-gray-400">
            <Target className="w-4 h-4" />
            <span>{formatCurrency(goal)}</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 mb-4 text-sm text-gray-400">
        <div className="flex items-center gap-1">
          <Users className="w-4 h-4" />
          <span>{participants} members</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          <span>{daysLeft} days left</span>
        </div>
      </div>

      {/* My Contribution (if member) */}
      {isMember && myContribution > 0 && (
        <div className="mb-4 p-3 bg-purple-500/20 rounded-lg">
          <div className="text-sm text-gray-400">My contribution</div>
          <div className="font-semibold gradient-text">{formatCurrency(myContribution)}</div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <GradientButton
          variant="primary"
          onClick={handleViewDetails}
          className="flex-1"
        >
          {isMember ? 'View Details' : 'View Basket'}
        </GradientButton>
        
        {!isMember && (
          <GradientButton
            variant="secondary"
            onClick={handleJoin}
            className="px-6"
          >
            Join
          </GradientButton>
        )}
      </div>
    </GlassCard>
  );
}
