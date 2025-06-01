
import { useHaptics } from './useNativeFeatures';

export function usePressFeedback() {
  const haptics = useHaptics();
  
  const handlePress = (event: React.MouseEvent) => {
    // Provide haptic feedback
    haptics.light();
    
    // Add visual press effect
    const target = event.currentTarget as HTMLElement;
    target.style.transform = 'scale(0.95)';
    setTimeout(() => {
      target.style.transform = 'scale(1)';
    }, 100);
  };

  const handleSuccess = () => {
    haptics.notification();
  };

  const handleError = () => {
    haptics.heavy();
  };

  return { 
    handlePress,
    handleSuccess,
    handleError
  };
}

export function useSwipeGestures() {
  const setupSwipeDetection = (element: HTMLElement, callbacks: {
    onSwipeLeft?: () => void;
    onSwipeRight?: () => void;
    onSwipeUp?: () => void;
    onSwipeDown?: () => void;
  }) => {
    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      endX = e.changedTouches[0].clientX;
      endY = e.changedTouches[0].clientY;
      
      const deltaX = endX - startX;
      const deltaY = endY - startY;
      const minSwipeDistance = 50;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Horizontal swipe
        if (Math.abs(deltaX) > minSwipeDistance) {
          if (deltaX > 0) {
            callbacks.onSwipeRight?.();
          } else {
            callbacks.onSwipeLeft?.();
          }
        }
      } else {
        // Vertical swipe
        if (Math.abs(deltaY) > minSwipeDistance) {
          if (deltaY > 0) {
            callbacks.onSwipeDown?.();
          } else {
            callbacks.onSwipeUp?.();
          }
        }
      }
    };

    element.addEventListener('touchstart', handleTouchStart);
    element.addEventListener('touchend', handleTouchEnd);

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  };

  return { setupSwipeDetection };
}
