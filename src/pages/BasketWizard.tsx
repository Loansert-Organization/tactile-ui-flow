
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WizardStyles } from '@/components/wizard/WizardStyles';
import { usePressFeedback } from '@/hooks/useInteractions';
import { useMyBasketsContext } from '@/contexts/MyBasketsContext';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { BasketWizardHeader } from '@/components/wizard/BasketWizardHeader';
import { BasketWizardBackground } from '@/components/wizard/BasketWizardBackground';
import { BasketNameForm } from '@/components/wizard/BasketNameForm';
import { BasketGoalForm } from '@/components/wizard/BasketGoalForm';
import { toast } from 'sonner';

const BasketWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isCreating, setIsCreating] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const navigate = useNavigate();
  const { handlePress } = usePressFeedback();
  const { createBasket } = useMyBasketsContext();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    goal: '',
    duration: '30'
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
      handleCreateBasket();
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
      await createBasket({
        name: formData.name,
        description: formData.description || `Private basket for ${formData.name}`,
        goal: parseInt(formData.goal),
        currentAmount: 0,
        progress: 0,
        participants: 1,
        daysLeft: parseInt(formData.duration),
        status: 'private',
        isPrivate: true
      });
      toast.success('Private basket created successfully!', {
        description: 'Your basket is ready to receive contributions.'
      });
      navigate('/baskets/mine');
    } catch (error) {
      toast.error('Failed to create basket', {
        description: 'Please try again or contact support if the issue persists.'
      });
    } finally {
      setIsCreating(false);
    }
  };

  const canProceed = () => {
    if (currentStep === 1) {
      return formData.name.trim() && formData.name.length <= 50 && formData.description.length <= 200;
    }
    return formData.goal && parseInt(formData.goal) > 0 && parseInt(formData.goal) <= 10000000;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      <WizardStyles />
      
      <BasketWizardBackground />

      <BasketWizardHeader
        currentStep={currentStep}
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
        </div>
      </div>

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
