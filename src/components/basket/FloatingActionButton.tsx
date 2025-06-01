
import React from 'react';
import { Plus } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface FloatingActionButtonProps {
  isCurrentUserCreator: boolean;
  onContribute: () => void;
}

export const FloatingActionButton = ({ isCurrentUserCreator, onContribute }: FloatingActionButtonProps) => {
  if (isCurrentUserCreator) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            disabled
            className="fixed bottom-6 right-6 w-14 h-14 bg-gray-500/50 rounded-full shadow-2xl flex items-center justify-center opacity-50 cursor-not-allowed z-50"
            aria-label="Cannot contribute to own basket"
          >
            <Plus className="w-6 h-6 text-white" />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>You cannot contribute to your own basket</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <button
      onClick={onContribute}
      className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-magenta-orange rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-50"
      aria-label="Add contribution"
    >
      <Plus className="w-6 h-6 text-white" />
    </button>
  );
};
