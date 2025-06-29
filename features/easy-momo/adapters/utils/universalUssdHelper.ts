// Auto-generated shim for universal USSD helper utilities
export interface UssdValidationResult {
  isValid: boolean;
  normalized: string;
  provider?: string;
  type?: string;
  confidence?: number;
}

export const validateUniversalUssd = (ussd: string): UssdValidationResult => {
  const normalized = ussd.replace(/[^0-9*#]/g, '');
  const isValid = /^\*\d+(\*\d+)*#$/.test(normalized);
  
  return {
    isValid,
    normalized,
    provider: normalized.startsWith('*182') ? 'MTN' : 'Unknown',
    type: 'payment',
    confidence: isValid ? 0.95 : 0.1
  };
};

export const normaliseUssd = (ussd: string): string => {
  return ussd.replace(/[^0-9*#]/g, '');
};

export const extractUssdFromQR = (qrData: string): string => {
  const ussdMatch = qrData.match(/\*\d+(\*\d+)*#/);
  return ussdMatch ? ussdMatch[0] : '';
};
