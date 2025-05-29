
import React, { useState, useEffect } from 'react';
import { Menu, Share2, Settings, X } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { usePressFeedback } from '@/hooks/useInteractions';

export const AppHeader = () => {
  const [showCoachMarks, setShowCoachMarks] = useState(false);
  const { handlePress } = usePressFeedback();

  useEffect(() => {
    // Show coach marks on first visit
    const hasSeenCoachMarks = localStorage.getItem('hasSeenCoachMarks');
    if (!hasSeenCoachMarks) {
      setTimeout(() => setShowCoachMarks(true), 1000);
    }
  }, []);

  const dismissCoachMarks = () => {
    setShowCoachMarks(false);
    localStorage.setItem('hasSeenCoachMarks', 'true');
  };

  return (
    <>
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
            
            <h1 className="text-xl font-bold gradient-text">Community Baskets</h1>
            
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

      {/* Coach Marks Overlay */}
      {showCoachMarks && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm">
          <div className="absolute top-20 left-6">
            <div className="relative">
              <GlassCard className="p-4 max-w-xs">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-sm">Menu</h3>
                  <button onClick={dismissCoachMarks} className="p-1">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-gray-300">Tap here to access your profile and settings</p>
              </GlassCard>
              <div className="absolute -top-2 left-4 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-white/20"></div>
            </div>
          </div>
          
          <div className="absolute top-20 right-20">
            <div className="relative">
              <GlassCard className="p-4 max-w-xs">
                <h3 className="font-semibold text-sm mb-2">Share & Settings</h3>
                <p className="text-xs text-gray-300">Share baskets or adjust your preferences</p>
              </GlassCard>
              <div className="absolute -top-2 right-4 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-white/20"></div>
            </div>
          </div>

          <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2">
            <GlassCard className="p-4 max-w-xs text-center">
              <h3 className="font-semibold text-sm mb-2">Bottom Navigation</h3>
              <p className="text-xs text-gray-300 mb-4">Navigate between different sections of the app</p>
              <button
                onClick={dismissCoachMarks}
                className="bg-gradient-magenta-orange px-4 py-2 rounded-lg text-sm font-medium"
              >
                Got it!
              </button>
            </GlassCard>
          </div>
        </div>
      )}
    </>
  );
};
