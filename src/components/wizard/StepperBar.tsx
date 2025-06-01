
import React from 'react';

interface StepperBarProps {
  currentStep: number;
  totalSteps?: number;
}

export const StepperBar: React.FC<StepperBarProps> = ({ currentStep, totalSteps = 2 }) => (
  <div className="text-center mb-8">
    <h1 className="text-xl font-bold mb-4 bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent">
      Create Private Basket
    </h1>
    <div className="flex gap-2 justify-center">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <div
          key={step}
          className={`h-2 rounded-full transition-all duration-500 ${
            step <= currentStep
              ? 'w-12 bg-gradient-to-r from-pink-500 to-orange-500'
              : 'w-8 bg-white/20'
          }`}
          style={{
            animation: step === currentStep ? 'stepper-fill 0.5s ease-out' : undefined,
            '--target-width': '100%'
          } as React.CSSProperties}
        />
      ))}
    </div>
  </div>
);
