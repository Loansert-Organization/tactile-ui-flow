
import React from 'react';
import { BasketNameForm } from '@/components/wizard/BasketNameForm';
import { BasketGoalForm } from '@/components/wizard/BasketGoalForm';
import { CountrySelector } from '@/components/wizard/CountrySelector';
import { CategorySelector } from '@/components/wizard/CategorySelector';
import { BasketWizardFormData, BasketWizardErrors } from '@/components/wizard/forms/BasketWizardFormData';

interface BasketWizardStepsProps {
  currentStep: number;
  formData: BasketWizardFormData;
  errors: BasketWizardErrors;
  onInputChange: (field: string, value: string) => void;
}

export const BasketWizardSteps: React.FC<BasketWizardStepsProps> = ({
  currentStep,
  formData,
  errors,
  onInputChange
}) => {
  return (
    <div className="max-w-lg mx-auto lg:max-w-2xl">
      {currentStep === 1 && (
        <BasketNameForm
          formData={formData}
          errors={errors}
          onInputChange={onInputChange}
        />
      )}

      {currentStep === 2 && (
        <BasketGoalForm
          formData={formData}
          errors={errors}
          onInputChange={onInputChange}
        />
      )}

      {currentStep === 3 && (
        <CategorySelector
          selectedCategory={formData.category}
          onCategorySelect={(category) => onInputChange('category', category)}
        />
      )}

      {currentStep === 4 && (
        <CountrySelector
          selectedCountry={formData.country}
          onCountrySelect={(country) => onInputChange('country', country)}
        />
      )}
    </div>
  );
};
