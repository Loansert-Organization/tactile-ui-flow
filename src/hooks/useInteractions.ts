
import { useCallback, useRef } from 'react';
import { useHaptics } from './useNativeFeatures';

export interface PressEvent {
  target: HTMLElement;
  clientX: number;
  clientY: number;
}

export const usePressFeedback = () => {
  const { light, medium } = useHaptics();

  const hapticFeedback = useCallback(async () => {
    // Use native haptics if available, fallback to web vibration
    try {
      await light();
    } catch {
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
    }
  }, [light]);

  const createRipple = useCallback((event: PressEvent) => {
    const element = event.target;
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.6);
      transform: scale(0);
      animation: ripple 0.6s ease-out;
      left: ${x}px;
      top: ${y}px;
      width: ${size}px;
      height: ${size}px;
      pointer-events: none;
    `;
    
    element.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }, []);

  const handlePress = useCallback(async (event: React.MouseEvent<HTMLElement>) => {
    const target = event.currentTarget;
    
    // Add squeeze animation
    target.style.transform = 'scale(0.95)';
    target.style.transition = 'transform 0.1s cubic-bezier(0.22, 1, 0.36, 1)';
    
    // Create ripple effect
    createRipple({
      target,
      clientX: event.clientX,
      clientY: event.clientY
    });
    
    // Enhanced haptic feedback
    await hapticFeedback();
    
    // Release animation
    setTimeout(() => {
      target.style.transform = 'scale(1)';
    }, 100);
  }, [createRipple, hapticFeedback]);

  return { handlePress, hapticFeedback, createRipple };
};

export const useSwipeGesture = (
  onSwipeLeft?: () => void,
  onSwipeRight?: () => void,
  threshold = 50
) => {
  const startX = useRef<number>(0);
  const startY = useRef<number>(0);
  const { medium } = useHaptics();

  const handleTouchStart = useCallback((event: React.TouchEvent) => {
    startX.current = event.touches[0].clientX;
    startY.current = event.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback(async (event: React.TouchEvent) => {
    const endX = event.changedTouches[0].clientX;
    const endY = event.changedTouches[0].clientY;
    
    const deltaX = endX - startX.current;
    const deltaY = endY - startY.current;
    
    // Check if horizontal swipe is more significant than vertical
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > threshold) {
      await medium();
      
      if (deltaX > 0 && onSwipeRight) {
        onSwipeRight();
      } else if (deltaX < 0 && onSwipeLeft) {
        onSwipeLeft();
      }
    }
  }, [onSwipeLeft, onSwipeRight, threshold, medium]);

  return { handleTouchStart, handleTouchEnd };
};

export const useLongPress = (
  onLongPress: () => void,
  delay = 500
) => {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const { heavy } = useHaptics();

  const start = useCallback(async () => {
    timeoutRef.current = setTimeout(async () => {
      await heavy();
      onLongPress();
    }, delay);
  }, [onLongPress, delay, heavy]);

  const clear = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  return {
    onMouseDown: start,
    onMouseUp: clear,
    onMouseLeave: clear,
    onTouchStart: start,
    onTouchEnd: clear,
  };
};
