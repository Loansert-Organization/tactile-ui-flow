
import React from 'react';
import { Plus, Users } from 'lucide-react';
import { GradientButton } from '@/components/ui/gradient-button';

interface BasketActionsProps {
  basketId: string;
  onContribute: () => void;
  onViewMembers: () => void;
}

export const BasketActions = ({ basketId, onContribute, onViewMembers }: BasketActionsProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <GradientButton
        variant="primary"
        onClick={onContribute}
        className="flex items-center justify-center gap-2"
      >
        <Plus className="w-5 h-5" />
        Contribute More
      </GradientButton>
      <GradientButton
        variant="secondary"
        onClick={onViewMembers}
        className="flex items-center justify-center gap-2"
      >
        <Users className="w-5 h-5" />
        View Members
      </GradientButton>
    </div>
  );
};
