
import React from 'react';

interface CharacterCounterProps {
  current: number;
  max: number;
  error?: boolean;
}

export const CharacterCounter: React.FC<CharacterCounterProps> = ({ current, max, error }) => (
  <div className={`text-xs mt-1 font-medium ${error ? 'text-red-400' : 'text-foreground/60 dark:text-foreground/50'}`}>
    {current}/{max}
  </div>
);
