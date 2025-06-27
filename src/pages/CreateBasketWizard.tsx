
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { usePressFeedback } from '@/hooks/useInteractions';
import { useWizardState } from '@/hooks/useWizardState';
import { CoachMarkOverlay } from '@/components/wizard/CoachMarkOverlay';
import { ConfettiAnimation } from '@/components/wizard/ConfettiAnimation';
import { WizardStyles } from '@/components/wizard/WizardStyles';
import { Step1 } from '@/components/wizard/Step1';
import { Step2 } from '@/components/wizard/Step2';
import { Step4 } from '@/components/wizard/Step4';

const CreateBasketWizard = () => {
  const { handlePress } = usePressFeedback();
  const {
    basketData,
    showCoachMark,
    setShowCoachMark,
    updateBasketData,
    handleBack,
    handleNext,
    handleComplete,
    handleGoToMyBaskets
  } = useWizardState();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-40 h-40 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-60 h-60 bg-gradient-to-r from-blue-500/20 to-teal-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Coach Mark Overlay */}
      {showCoachMark && <CoachMarkOverlay onDismiss={() => setShowCoachMark(false)} />}

      {/* Confetti Animation */}
      <ConfettiAnimation trigger={false} />

      <Routes>
        <Route path="/step/1" element={
          <Step1 
            basketData={basketData}
            updateBasketData={updateBasketData}
            onBack={handleBack}
            onNext={() => handleNext('2')}
            handlePress={handlePress}
          />
        } />
        <Route path="/step/2" element={
          <Step2 
            basketData={basketData}
            updateBasketData={updateBasketData}
            onBack={() => handleNext('1')}
            onNext={handleComplete}
            handlePress={handlePress}
          />
        } />
        <Route path="/step/4" element={
          <Step4 
            basketData={basketData}
            onBack={handleGoToMyBaskets}
            handlePress={handlePress}
          />
        } />
      </Routes>

      <WizardStyles />
    </div>
  );
};

export default CreateBasketWizard;
