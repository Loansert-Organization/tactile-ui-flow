
export interface BasketWizardFormData {
  name: string;
  description: string;
  goal: string;
  duration: string;
  category: string;
  country: string;
}

export interface BasketWizardErrors {
  name: boolean;
  description: boolean;
  goal: boolean;
}

export const initialFormData: BasketWizardFormData = {
  name: '',
  description: '',
  goal: '',
  duration: '30',
  category: 'personal',
  country: 'RW'
};

export const initialErrors: BasketWizardErrors = {
  name: false,
  description: false,
  goal: false
};
