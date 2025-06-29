// Auto-generated shim for haptic feedback utility
export const triggerHapticFeedback = (type: 'light' | 'medium' | 'heavy' = 'light') => {
  console.log('Haptic feedback:', type);
  
  if (navigator.vibrate) {
    const patterns = {
      light: [50],
      medium: [100],
      heavy: [200]
    };
    navigator.vibrate(patterns[type]);
  }
};

export const hapticSuccess = () => triggerHapticFeedback('light');
export const hapticError = () => triggerHapticFeedback('heavy');
export const hapticWarning = () => triggerHapticFeedback('medium');

export default {
  triggerHapticFeedback,
  hapticSuccess,
  hapticError,
  hapticWarning
};
