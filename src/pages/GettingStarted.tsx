import React, { useState } from 'react';
import { ChevronRight, Users, Target, MessageCircle, Share2 } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { GradientButton } from '@/components/ui/gradient-button';
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

const GettingStarted = () => {
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
    <div className="min-h-screen flex flex-col p-6 bg-gradient-to-br from-purple-900 via-blue-900 to-teal-900">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold gradient-text">Getting Started</h1>
          <p className="text-gray-400">Learn how to use Community Baskets</p>
        </div>
        <button
          onClick={skipTutorial}
          className="text-gray-400 hover:text-white transition-colors"
        >
          Skip
        </button>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center gap-2 mb-8">
        {steps.map((_, index) => (
          <div
            key={index}
            className={`h-2 flex-1 rounded-full transition-all ${
              index <= currentStep ? 'bg-gradient-magenta-orange' : 'bg-gray-700'
            }`}
          />
        ))}
      </div>

      {/* Current Step */}
      <div className="flex-1 flex flex-col justify-center">
        <GlassCard className="p-8 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-purple-pink flex items-center justify-center">
            {React.createElement(steps[currentStep].icon, {
              className: "w-10 h-10 text-white"
            })}
          </div>

          <h2 className="text-2xl font-bold mb-4 gradient-text">
            {steps[currentStep].title}
          </h2>

          <p className="text-gray-300 mb-8 leading-relaxed">
            {steps[currentStep].description}
          </p>

          {/* Tips */}
          <div className="text-left mb-8">
            <h3 className="font-semibold mb-4 text-center">Pro Tips:</h3>
            <ul className="space-y-2">
              {steps[currentStep].tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-3 text-sm text-gray-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-pink-400 mt-2 flex-shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          <GradientButton
            variant="primary"
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
          </GradientButton>
        </GlassCard>
      </div>

      {/* Step Counter */}
      <div className="text-center mt-6">
        <span className="text-gray-400">
          {currentStep + 1} of {steps.length}
        </span>
      </div>
    </div>
  );
};

export default GettingStarted;
