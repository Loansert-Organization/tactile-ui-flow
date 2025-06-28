
import React, { useState } from 'react';
import { ChevronRight, Users, Target, MessageCircle, Share2 } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { useNavigate } from 'react-router-dom';

const steps = [
  {
    icon: Users,
    title: 'Join or Create Baskets',
    description: 'Create a new basket for your goal or join existing ones with a code',
    tips: ['Set a clear goal amount', 'Write a compelling description', 'Choose privacy settings']
  },
  {
    icon: Target,
    title: 'Make Contributions',
    description: 'Add funds to baskets you care about, either one-time or recurring',
    tips: ['Start with small amounts', 'Set up recurring contributions', 'Track your progress']
  },
  {
    icon: MessageCircle,
    title: 'Stay Updated',
    description: 'Follow the chat to see progress and connect with other contributors',
    tips: ['Check updates regularly', 'Celebrate milestones', 'Encourage others']
  },
  {
    icon: Share2,
    title: 'Invite Friends',
    description: 'Share basket codes with friends to grow your community',
    tips: ['Share on social media', 'Send personal invites', 'Explain the goal clearly']
  }
];

export const GettingStarted = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      navigate('/');
    }
  };

  const skipTutorial = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col p-4 sm:p-6 bg-gradient-hero">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold gradient-text">Getting Started</h1>
          <p className="text-white/80 text-base sm:text-lg mt-2">Learn how to use Community Baskets</p>
        </div>
        <EnhancedButton
          onClick={skipTutorial}
          variant="ghost"
          className="text-white/70 hover:text-white hover:bg-white/10"
        >
          Skip
        </EnhancedButton>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center gap-2 mb-8 sm:mb-12">
        {steps.map((_, index) => (
          <div
            key={index}
            className={`h-2 flex-1 rounded-full transition-all duration-500 ${
              index <= currentStep ? 'bg-gradient-accent' : 'bg-white/20'
            }`}
          />
        ))}
      </div>

      {/* Current Step */}
      <div className="flex-1 flex flex-col justify-center">
        <GlassCard variant="strong" size="lg" className="text-center animate-scale-in">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6 rounded-full bg-gradient-primary flex items-center justify-center">
            {React.createElement(steps[currentStep].icon, {
              className: "w-8 h-8 sm:w-10 sm:h-10 text-white"
            })}
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold mb-4 gradient-text">
            {steps[currentStep].title}
          </h2>

          <p className="text-white/80 text-base sm:text-lg mb-8 leading-relaxed max-w-md mx-auto">
            {steps[currentStep].description}
          </p>

          {/* Tips */}
          <div className="text-left mb-8">
            <h3 className="font-semibold mb-4 text-center text-white">Pro Tips:</h3>
            <ul className="space-y-3">
              {steps[currentStep].tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-3 text-sm sm:text-base text-white/70">
                  <div className="w-2 h-2 rounded-full bg-gradient-accent mt-2 flex-shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          <EnhancedButton
            variant="gradient"
            size="lg"
            className="w-full flex items-center justify-center gap-2"
            onClick={nextStep}
          >
            {currentStep < steps.length - 1 ? (
              <>
                Next
                <ChevronRight className="w-5 h-5" />
              </>
            ) : (
              'Get Started'
            )}
          </EnhancedButton>
        </GlassCard>
      </div>

      {/* Step Counter */}
      <div className="text-center mt-6">
        <span className="text-white/60 text-sm sm:text-base">
          {currentStep + 1} of {steps.length}
        </span>
      </div>
    </div>
  );
};
