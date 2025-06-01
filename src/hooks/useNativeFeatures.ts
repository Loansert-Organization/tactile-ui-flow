
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
