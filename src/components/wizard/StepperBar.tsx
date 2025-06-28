
import React from 'react';

interface StepperBarProps {
  currentStep: number;
  totalSteps?: number;
}

export const StepperBar: React.FC<StepperBarProps> = ({ currentStep, totalSteps = 2 }) => (
  <div className="text-center mb-6 sm:mb-8">
    <h1 className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-pink-400 to-orange-400 dark:from-pink-300 dark:to-orange-300 light:from-pink-600 light:to-orange-600 bg-clip-text text-transparent px-2">
      Create Private Basket
    </h1>
    <div className="flex gap-1.5 sm:gap-2 justify-center">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <div
          key={step}
          className={`h-1.5 sm:h-2 rounded-full transition-all duration-500 ${
            step <= currentStep
              ? 'w-8 sm:w-12 bg-gradient-to-r from-pink-500 to-orange-500 dark:from-pink-400 dark:to-orange-400 light:from-pink-600 light:to-orange-600'
              : 'w-6 sm:w-8 bg-white/20 dark:bg-white/10 light:bg-gray-300'
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
