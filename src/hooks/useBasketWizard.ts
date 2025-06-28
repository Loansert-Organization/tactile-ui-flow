import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMyBaskets } from '@/hooks/useMyBaskets';
import { useAuthContext } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { 
  BasketWizardFormData, 
  BasketWizardErrors, 
  initialFormData, 
  initialErrors 
} from '@/components/wizard/forms/BasketWizardFormData';
import { validateStep1, validateStep2 } from '@/components/wizard/forms/BasketWizardValidation';
import { useAdmin } from '@/hooks/useAdmin';

export const useBasketWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isCreating, setIsCreating] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [formData, setFormData] = useState<BasketWizardFormData>(initialFormData);
  const [errors, setErrors] = useState<BasketWizardErrors>(initialErrors);

  const navigate = useNavigate();
  const { createBasket } = useMyBaskets();
  const { ensureAnonymousAuth } = useAuthContext();
  const { isAdmin } = useAdmin();

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

  const handleNext = () => {
    if (currentStep === 1) {
      const newErrors = validateStep1(formData);
      setErrors(newErrors);
      if (!Object.values(newErrors).some(Boolean)) {
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      const newErrors = validateStep2(formData);
      setErrors(newErrors);
      if (!newErrors.goal) {
        setCurrentStep(3);
      }
    } else if (currentStep === 3) {
      setCurrentStep(4);
    } else if (currentStep === 4) {
      // No auth prompt needed - proceed directly to basket creation
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

  const handleCreateBasket = async () => {
    setIsCreating(true);
    try {
      // Ensure anonymous auth is available
      await ensureAnonymousAuth();
      
      // Enforce admin-only public basket creation
      const isPublic = formData.isPublic;
      if (isPublic && !isAdmin) {
        toast.error('Only admins can create public baskets.');
        setIsCreating(false);
        return;
      }
      
      await createBasket({
        name: formData.name,
        description: formData.description || `Private basket for ${formData.name}`,
        goal: parseInt(formData.goal),
        duration: parseInt(formData.duration),
        category: formData.category,
        country: formData.country,
        isPrivate: !isPublic,
        tags: []
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

  const handleExitConfirm = () => {
    setShowExitConfirm(false);
    navigate('/baskets/mine');
  };

  const handleProceedAsGuest = () => {
    setShowAuthPrompt(false);
    handleCreateBasket();
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

  return {
    currentStep,
    isCreating,
    showExitConfirm,
    showAuthPrompt,
    formData,
    errors,
    handleInputChange,
    handleNext,
    handleBack,
    handleCreateBasket,
    handleExitConfirm,
    handleProceedAsGuest,
    setShowExitConfirm,
    setShowAuthPrompt,
    getStepTitle
  };
};
