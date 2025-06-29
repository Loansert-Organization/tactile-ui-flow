// Auto-generated shim for phone validation utilities
export const validatePhone = (phone: string): boolean => {
  console.log('Validating phone:', phone);
  // Rwanda phone pattern: 07xxxxxxxx
  const rwandaPattern = /^07[2-9]\d{7}$/;
  return rwandaPattern.test(phone);
};

export const formatPhoneInput = (input: string): string => {
  // Remove non-digits
  const digits = input.replace(/\D/g, '');
  
  // Format as Rwanda number
  if (digits.length <= 10) {
    return digits;
  }
  
  return digits.slice(0, 10);
};

export const normalizePhone = (phone: string): string => {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('250')) {
    return '0' + digits.slice(3);
  }
  return digits.startsWith('0') ? digits : '0' + digits;
};

export default {
  validatePhone,
  formatPhoneInput,
  normalizePhone
}; 