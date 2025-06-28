
import React from 'react';

interface CharacterCounterProps {
  current: number;
  max: number;
  error?: boolean;
}

export const CharacterCounter: React.FC<CharacterCounterProps> = ({ current, max, error }) => (
  <div className={`text-xs mt-1 ${error ? 'text-red-400' : 'text-muted-foreground'}`}>
    {current}/{max}
  </div>
);
