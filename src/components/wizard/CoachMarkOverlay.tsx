
import React from 'react';
import { X, Share2 } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';

interface CoachMarkOverlayProps {
  onDismiss: () => void;
}

export const CoachMarkOverlay: React.FC<CoachMarkOverlayProps> = ({ onDismiss }) => (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
    <GlassCard className="p-6 max-w-sm relative">
      <button
        onClick={onDismiss}
        className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/10"
      >
        <X className="w-4 h-4" />
      </button>
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-gradient-to-r from-teal-500/20 to-blue-500/20 rounded-full flex items-center justify-center mx-auto">
          <Share2 className="w-8 h-8 text-teal-300" />
        </div>
        <h3 className="text-lg font-semibold gradient-text">Welcome to the Basket Wizard!</h3>
        <p className="text-sm text-gray-300">
          Create your private savings group. Only people with the link can join.
        </p>
        <Button onClick={onDismiss} className="w-full neuro-button">
          Got it!
        </Button>
      </div>
    </GlassCard>
  </div>
);
