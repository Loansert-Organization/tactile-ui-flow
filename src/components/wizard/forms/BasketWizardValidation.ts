
import { BasketWizardFormData, BasketWizardErrors } from './BasketWizardFormData';

export const validateStep1 = (formData: BasketWizardFormData): BasketWizardErrors => {
  return {
    name: !formData.name.trim() || formData.name.length > 50,
    description: formData.description.length > 200,
    goal: false
  };
};

export const validateStep2 = (formData: BasketWizardFormData): BasketWizardErrors => {
  const goalNum = parseInt(formData.goal);
  const goalError = !formData.goal || goalNum <= 0 || goalNum > 10000000;
  
  return {
    name: false,
    description: false,
    goal: goalError
  };
};

export const canProceedFromStep = (step: number, formData: BasketWizardFormData): boolean => {
  if (step === 1) {
    return formData.name.trim() && formData.name.length <= 50 && formData.description.length <= 200;
  } else if (step === 2) {
    return formData.goal && parseInt(formData.goal) > 0 && parseInt(formData.goal) <= 10000000;
  }
  return true;
};
