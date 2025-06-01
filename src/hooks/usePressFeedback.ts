
import { useHaptics } from './useNativeFeatures';

export function usePressFeedback() {
  const haptics = useHaptics();
  
  const handlePress = (event: React.MouseEvent) => {
    // Provide visual and haptic feedback for button presses
    haptics.light();
    
    // Add visual press effect
    const target = event.currentTarget as HTMLElement;
    target.style.transform = 'scale(0.95)';
    setTimeout(() => {
      target.style.transform = 'scale(1)';
    }, 100);
  };

  return { handlePress };
}
