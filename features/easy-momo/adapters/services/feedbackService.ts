// Auto-generated shim for feedback service
export const feedbackService = {
  hapticFeedback: (type: 'success' | 'error' | 'warning' = 'success') => {
    console.log('Haptic feedback:', type);
    // Could implement actual haptic feedback for mobile devices
    if (navigator.vibrate) {
      const pattern = type === 'success' ? [100] : type === 'error' ? [100, 50, 100] : [50];
      navigator.vibrate(pattern);
    }
  },
  
  visualFeedback: (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    console.log('Visual feedback:', message, type);
  },
  
  audioFeedback: (sound: 'beep' | 'success' | 'error' = 'beep') => {
    console.log('Audio feedback:', sound);
  },
  
  showToast: (message: string, duration: number = 3000) => {
    console.log('Toast:', message, `(${duration}ms)`);
  }
};

export default feedbackService; 