
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ArrowRight } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { GradientButton } from '@/components/ui/gradient-button';
import { usePressFeedback } from '@/hooks/useInteractions';

const Welcome = () => {
  const navigate = useNavigate();
  const { handlePress } = usePressFeedback();
  const [showCoachMarks, setShowCoachMarks] = useState(true);

  const dismissCoachMarks = () => {
    setShowCoachMarks(false);
  };

  const handleGetStarted = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      <div className="flex items-center justify-center min-h-screen">
        <GlassCard className="max-w-md mx-auto p-8 text-center">
          <div className="mb-8">
            <h1 className="text-4xl font-bold gradient-text mb-4">Welcome to IKANISA</h1>
            <p className="text-gray-300 leading-relaxed">
              Join community savings groups, contribute regularly, and achieve your financial goals together.
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                <div className="w-8 h-8 bg-gradient-teal-blue rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">1</span>
                </div>
                <span className="text-gray-300">Create or join a basket</span>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                <div className="w-8 h-8 bg-gradient-purple-pink rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">2</span>
                </div>
                <span className="text-gray-300">Make regular contributions</span>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                <div className="w-8 h-8 bg-gradient-magenta-orange rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">3</span>
                </div>
                <span className="text-gray-300">Achieve your goals together</span>
              </div>
            </div>

            <GradientButton
              onClick={(e) => {
                handlePress(e);
                handleGetStarted();
              }}
              className="w-full"
              size="lg"
            >
              Get Started <ArrowRight className="w-5 h-5 ml-2" />
            </GradientButton>
          </div>
        </GlassCard>
      </div>

      {/* Coach Marks Overlay */}
      {showCoachMarks && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm">
          <div className="absolute top-20 left-6">
            <div className="relative">
              <GlassCard className="p-4 max-w-xs">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-sm">Navigation</h3>
                  <button onClick={dismissCoachMarks} className="p-1">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-gray-300">Use the header to access menu and settings</p>
              </GlassCard>
              <div className="absolute -top-2 left-4 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-white/20"></div>
            </div>
          </div>
          
          <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2">
            <GlassCard className="p-4 max-w-xs text-center">
              <h3 className="font-semibold text-sm mb-2">Bottom Navigation</h3>
              <p className="text-xs text-gray-300 mb-4">Quickly access Feed, My Baskets, and Create new baskets</p>
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
    </div>
  );
};

export default Welcome;
