
import React from 'react';
import { WizardStyles } from '@/components/wizard/WizardStyles';
import { usePressFeedback } from '@/hooks/useInteractions';
import { BasketWizardHeader } from '@/components/wizard/BasketWizardHeader';
import { BasketWizardBackground } from '@/components/wizard/BasketWizardBackground';
import { BasketWizardSteps } from '@/components/wizard/steps/BasketWizardSteps';
import { BasketWizardModals } from '@/components/wizard/modals/BasketWizardModals';
import { useBasketWizard } from '@/hooks/useBasketWizard';
import { canProceedFromStep } from '@/components/wizard/forms/BasketWizardValidation';

const BasketWizard = () => {
  const { handlePress } = usePressFeedback();
  const {
    currentStep,
    isCreating,
    showExitConfirm,
    showAuthPrompt,
    formData,
    errors,
    handleInputChange,
    handleNext,
    handleBack,
    handleExitConfirm,
    handleProceedAsGuest,
    setShowExitConfirm,
    setShowAuthPrompt,
    getStepTitle
  } = useBasketWizard();

  const canProceed = () => canProceedFromStep(currentStep, formData);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <WizardStyles />
      
      <BasketWizardBackground />

      <BasketWizardHeader
        currentStep={currentStep}
        totalSteps={4}
        stepTitle={getStepTitle()}
        canProceed={canProceed()}
        isCreating={isCreating}
        onBack={handleBack}
        onNext={handleNext}
        onPress={handlePress}
      />

      <div className="relative z-10 px-4 sm:px-6 lg:px-8 pb-24 sm:pb-32">
        <BasketWizardSteps
          currentStep={currentStep}
          formData={formData}
          errors={errors}
          onInputChange={handleInputChange}
        />
      </div>

      <BasketWizardModals
        showAuthPrompt={showAuthPrompt}
        showExitConfirm={showExitConfirm}
        basketName={formData.name}
        onCloseAuthPrompt={() => setShowAuthPrompt(false)}
        onCloseExitConfirm={() => setShowExitConfirm(false)}
        onExitConfirm={handleExitConfirm}
        onProceedAsGuest={handleProceedAsGuest}
      />
    </div>
  );
};

export default BasketWizard;
