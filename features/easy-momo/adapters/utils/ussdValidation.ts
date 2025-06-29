// Auto-generated shim for USSD validation utilities
export interface USSDValidationResult {
  isValid: boolean;
  normalized: string;
  errors: string[];
  provider?: string;
  type?: 'payment' | 'balance' | 'other';
}

export const generateUSSDFromInputs = (phone: string, amount: number): string => {
  console.log('Generating USSD from inputs:', { phone, amount });
  return `*182*1*1*${phone}*${amount}#`;
};

export const validateUSSDString = (ussd: string): USSDValidationResult => {
  const isValid = /^\*\d+(\*\d+)*#$/.test(ussd);
  return {
    isValid,
    normalized: ussd.replace(/[^0-9*#]/g, ''),
    errors: isValid ? [] : ['Invalid USSD format'],
    provider: ussd.startsWith('*182') ? 'MTN' : 'Unknown',
    type: 'payment'
  };
};

export const encodeUssdForTel = (ussd: string): string => {
  return `tel:${encodeURIComponent(ussd)}`;
};

export default {
  generateUSSDFromInputs,
  validateUSSDString,
  encodeUssdForTel
}; 