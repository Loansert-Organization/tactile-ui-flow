// Auto-generated shim for USSD helper utilities
export const extractUSSDFromQR = (qrData: string): string => {
  console.log('Extracting USSD from QR:', qrData);
  // Simple extraction logic
  const ussdMatch = qrData.match(/\*\d+(\*\d+)*#/);
  return ussdMatch ? ussdMatch[0] : '';
};

export const validateUSSDFormat = (ussd: string): boolean => {
  const ussdPattern = /^\*\d+(\*\d+)*#$/;
  return ussdPattern.test(ussd);
};

export const generateUSSDCode = (params: any): string => {
  console.log('Generating USSD code:', params);
  return `*182*1*1*${params.phone || '0788123456'}*${params.amount || '1000'}#`;
};

export const formatUSSDForTel = (ussd: string): string => {
  return `tel:${encodeURIComponent(ussd)}`;
};

export const normalizeUSSD = (ussd: string): string => {
  return ussd.replace(/[^0-9*#]/g, '');
};

export default {
  extractUSSDFromQR,
  validateUSSDFormat,
  generateUSSDCode,
  formatUSSDForTel,
  normalizeUSSD
}; 