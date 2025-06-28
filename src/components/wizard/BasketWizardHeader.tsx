
import React from 'react';
import { ArrowLeft, Plus, ArrowRight } from 'lucide-react';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { StepperBar } from '@/components/wizard/StepperBar';

interface BasketWizardHeaderProps {
  currentStep: number;
  canProceed: boolean;
  isCreating: boolean;
  onBack: () => void;
  onNext: () => void;
  onPress: (event: React.MouseEvent) => void;
}

export const BasketWizardHeader: React.FC<BasketWizardHeaderProps> = ({
  currentStep,
  canProceed,
  isCreating,
  onBack,
  onNext,
  onPress
}) => {
  return (
    <div className="relative z-10 p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6 sm:mb-8">
        <EnhancedButton
          variant="glass"
          size="icon"
          onClick={(e) => {
            onPress(e);
            onBack();
          }}
          className="backdrop-blur-xl hover:scale-105 active:scale-95 transition-all"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </EnhancedButton>

        <EnhancedButton
          variant="gradient-primary"
          size="icon"
          onClick={(e) => {
            onPress(e);
            onNext();
          }}
          disabled={!canProceed}
          loading={isCreating}
          className="hover:scale-105 active:scale-95 transition-all"
          aria-label={currentStep === 1 ? "Next Step" : "Create Basket"}
        >
          {currentStep === 1 ? (
            <ArrowRight className="w-5 h-5" />
          ) : (
            <Plus className="w-5 h-5" />
          )}
        </EnhancedButton>
      </div>

      <StepperBar currentStep={currentStep} totalSteps={2} />
    </div>
  );
};
