import React from 'react';
import { BasketNameForm } from '@/components/wizard/BasketNameForm';
import { BasketGoalForm } from '@/components/wizard/BasketGoalForm';
import { CountrySelector } from '@/components/wizard/CountrySelector';
import { CategorySelector } from '@/components/wizard/CategorySelector';
import { BasketWizardFormData, BasketWizardErrors } from '@/components/wizard/forms/BasketWizardFormData';
import { useAdmin } from '@/hooks/useAdmin';

interface BasketWizardStepsProps {
  currentStep: number;
  formData: BasketWizardFormData;
  errors: BasketWizardErrors;
  onInputChange: (field: string, value: string) => void;
}

const PrivacySelector: React.FC<{
  isPublic: boolean;
  onChange: (isPublic: boolean) => void;
  disabled?: boolean;
}> = ({ isPublic, onChange, disabled }) => (
  <div className="space-y-2">
    <label className="block text-foreground font-semibold text-base sm:text-lg">
      Basket Privacy
    </label>
    <div className="flex gap-4">
      <label className="flex items-center gap-2">
        <input
          type="radio"
          name="privacy"
          value="private"
          checked={!isPublic}
          onChange={() => onChange(false)}
          disabled={disabled}
        />
        Private
      </label>
      <label className="flex items-center gap-2">
        <input
          type="radio"
          name="privacy"
          value="public"
          checked={isPublic}
          onChange={() => onChange(true)}
          disabled={disabled}
        />
        Public (admin only)
      </label>
    </div>
    {disabled && (
      <p className="text-xs text-gray-400 mt-1">Only admins can create public baskets.</p>
    )}
  </div>
);

export const BasketWizardSteps: React.FC<BasketWizardStepsProps> = ({
  currentStep,
  formData,
  errors,
  onInputChange
}) => {
  const { isAdmin } = useAdmin();
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

      {currentStep === 5 && (
        <PrivacySelector
          isPublic={formData.isPublic}
          onChange={(isPublic) => onInputChange('isPublic', isPublic)}
          disabled={!isAdmin}
        />
      )}
    </div>
  );
};
