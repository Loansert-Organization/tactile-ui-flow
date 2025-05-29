
import React from 'react';
import { Menu, Share2, Settings } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { usePressFeedback } from '@/hooks/useInteractions';

export const AppHeader = () => {
  const { handlePress } = usePressFeedback();

  return (
    <header className="sticky top-0 z-50 w-full">
      <GlassCard className="m-2 px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={handlePress}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors focus-gradient"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <h1 className="text-xl font-bold gradient-text">IKANISA</h1>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handlePress}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors focus-gradient"
              aria-label="Share"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button
              onClick={handlePress}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors focus-gradient"
              aria-label="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </GlassCard>
    </header>
  );
};
