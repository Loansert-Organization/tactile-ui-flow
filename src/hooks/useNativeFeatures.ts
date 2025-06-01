
// Minimal stub so import in App.tsx compiles without error.
export function useNativeFeatures() {
  const initializeNativeFeatures = () => {
    console.log('Native features initialized (stub)');
  };

  return { 
    isNative: false, 
    isPWA: false,
    initializeNativeFeatures
  };
}

// Add the missing useHaptics export with all required methods
export function useHaptics() {
  return {
    impact: () => {},
    notification: () => {},
    selection: () => {},
    light: () => {},
    medium: () => {},
    heavy: () => {}
  };
}
