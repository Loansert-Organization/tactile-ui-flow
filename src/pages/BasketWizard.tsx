
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WizardStyles } from '@/components/wizard/WizardStyles';
import { usePressFeedback } from '@/hooks/useInteractions';
import { useMyBaskets } from '@/hooks/useMyBaskets';
import { useAuthContext } from '@/contexts/AuthContext';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { BasketWizardHeader } from '@/components/wizard/BasketWizardHeader';
import { BasketWizardBackground } from '@/components/wizard/BasketWizardBackground';
import { BasketNameForm } from '@/components/wizard/BasketNameForm';
import { BasketGoalForm } from '@/components/wizard/BasketGoalForm';
import { CountrySelector } from '@/components/wizard/CountrySelector';
import { CategorySelector } from '@/components/wizard/CategorySelector';
import { AuthPromptModal } from '@/components/wizard/AuthPromptModal';
import { toast } from 'sonner';

const BasketWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isCreating, setIsCreating] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const navigate = useNavigate();
  const { handlePress } = usePressFeedback();
  const { createBasket } = useMyBaskets();
  const { user } = useAuthContext();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    goal: '',
    duration: '30',
    category: 'personal',
    country: 'RW'
  });
  const [errors, setErrors] = useState({
    name: false,
    description: false,
    goal: false
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [field]: false
      }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {
      name: !formData.name.trim() || formData.name.length > 50,
      description: formData.description.length > 200,
      goal: false
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const validateStep2 = () => {
    const goalNum = parseInt(formData.goal);
    const goalError = !formData.goal || goalNum <= 0 || goalNum > 10000000;
    setErrors(prev => ({
      ...prev,
      goal: goalError
    }));
    return !goalError;
  };

  const handleNext = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    } else if (currentStep === 3) {
      setCurrentStep(4);
    } else if (currentStep === 4) {
      // Check authentication before final submission
      if (!user) {
        setShowAuthPrompt(true);
      } else {
        handleCreateBasket();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      if (formData.name || formData.description || formData.goal !== '') {
        setShowExitConfirm(true);
      } else {
        navigate('/baskets/mine');
      }
    }
  };

  const handleExitConfirm = () => {
    setShowExitConfirm(false);
    navigate('/baskets/mine');
  };

  const handleCreateBasket = async () => {
    setIsCreating(true);
    try {
      console.log('Creating basket with form data:', formData);
      
      await createBasket({
        name: formData.name,
        description: formData.description || `Private basket for ${formData.name}`,
        goal: parseInt(formData.goal),
        duration: parseInt(formData.duration),
        category: formData.category,
        country: formData.country,
        isPrivate: true,
        tags: [] // Add empty tags array
      });
      
      toast.success('Basket created successfully!', {
        description: 'Your basket is ready to receive contributions.'
      });
      navigate('/baskets/mine');
    } catch (error: any) {
      console.error('Basket creation error:', error);
      toast.error('Failed to create basket', {
        description: error.message || 'Please try again or contact support if the issue persists.'
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleProceedAsGuest = () => {
    setShowAuthPrompt(false);
    toast.info('Demo basket created', {
      description: 'This is a demo basket. Sign up to create real baskets!'
    });
    navigate('/baskets/mine');
  };

  const canProceed = () => {
    if (currentStep === 1) {
      return formData.name.trim() && formData.name.length <= 50 && formData.description.length <= 200;
    } else if (currentStep === 2) {
      return formData.goal && parseInt(formData.goal) > 0 && parseInt(formData.goal) <= 10000000;
    }
    return true;
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'Name Your Basket';
      case 2: return 'Set Your Goal';
      case 3: return 'Choose Category';
      case 4: return 'Select Country';
      default: return 'Create Basket';
    }
  };

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

      {/* Content */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 pb-24 sm:pb-32">
        <div className="max-w-lg mx-auto lg:max-w-2xl">
          {currentStep === 1 && (
            <BasketNameForm
              formData={formData}
              errors={errors}
              onInputChange={handleInputChange}
            />
          )}

          {currentStep === 2 && (
            <BasketGoalForm
              formData={formData}
              errors={errors}
              onInputChange={handleInputChange}
            />
          )}

          {currentStep === 3 && (
            <CategorySelector
              selectedCategory={formData.category}
              onCategorySelect={(category) => handleInputChange('category', category)}
            />
          )}

          {currentStep === 4 && (
            <CountrySelector
              selectedCountry={formData.country}
              onCountrySelect={(country) => handleInputChange('country', country)}
            />
          )}
        </div>
      </div>

      {/* Auth Prompt Modal */}
      <AuthPromptModal
        isOpen={showAuthPrompt}
        onClose={() => setShowAuthPrompt(false)}
        basketName={formData.name}
        onProceedAsGuest={handleProceedAsGuest}
      />

      {/* Exit Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showExitConfirm}
        onClose={() => setShowExitConfirm(false)}
        onConfirm={handleExitConfirm}
        title="Discard Changes?"
        description="You have unsaved changes. Are you sure you want to leave without creating your basket?"
        confirmText="Discard"
        cancelText="Continue Editing"
        variant="destructive"
      />
    </div>
  );
};

export default BasketWizard;
