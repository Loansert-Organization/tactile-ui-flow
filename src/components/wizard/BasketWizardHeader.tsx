
import React from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface BasketWizardHeaderProps {
  currentStep: number;
  totalSteps?: number;
  stepTitle: string;
  canProceed: boolean;
  isCreating: boolean;
  onBack: () => void;
  onNext: () => void;
  onPress: (e: React.MouseEvent) => void;
}

export const BasketWizardHeader: React.FC<BasketWizardHeaderProps> = ({
  currentStep,
  totalSteps = 4,
  stepTitle,
  canProceed,
  isCreating,
  onBack,
  onNext,
  onPress
}) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="relative z-20 pt-6 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg mx-auto lg:max-w-2xl">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={(e) => {
              onPress(e);
              onBack();
            }}
            className="p-2 rounded-full hover:bg-white/10 transition-colors focus-gradient"
            style={{ minWidth: '44px', minHeight: '44px' }}
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>

          <div className="text-center">
            <div className="text-sm text-white/70 mb-1">
              Step {currentStep} of {totalSteps}
            </div>
            <h1 className="text-xl font-semibold text-white">
              {stepTitle}
            </h1>
          </div>

          <Button
            onClick={(e) => {
              onPress(e);
              onNext();
            }}
            disabled={!canProceed || isCreating}
            className={`rounded-full px-6 py-2 font-medium transition-all duration-200 ${
              canProceed && !isCreating
                ? 'bg-white text-black hover:bg-white/90 hover:scale-105'
                : 'bg-white/20 text-white/50 cursor-not-allowed'
            }`}
            style={{ minWidth: '44px', minHeight: '44px' }}
          >
            {isCreating ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : currentStep === totalSteps ? (
              <>
                <Check className="w-4 h-4 mr-1" />
                Create
              </>
            ) : (
              'Next'
            )}
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <Progress 
            value={progress} 
            className="h-2 bg-white/20"
          />
        </div>
      </div>
    </div>
  );
};
