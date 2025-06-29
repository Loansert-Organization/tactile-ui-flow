// Auto-generated shim for performance monitoring hook
import { useCallback, useRef } from 'react';

export const usePerformanceMonitoring = () => {
  const timersRef = useRef<Map<string, number>>(new Map());
  
  const startTimer = useCallback((label: string) => {
    timersRef.current.set(label, performance.now());
    console.log('Performance timer started:', label);
  }, []);
  
  const endTimer = useCallback((label: string) => {
    const startTime = timersRef.current.get(label);
    if (startTime) {
      const duration = performance.now() - startTime;
      console.log(`Performance timer "${label}": ${duration.toFixed(2)}ms`);
      timersRef.current.delete(label);
      return duration;
    }
    return 0;
  }, []);
  
  const recordMetric = useCallback((metric: string, value: number) => {
    console.log('Performance metric:', metric, value);
  }, []);
  
  const trackOperation = useCallback(async (label: string, operation: () => Promise<any>) => {
    startTimer(label);
    try {
      const result = await operation();
      endTimer(label);
      return result;
    } catch (error) {
      endTimer(label);
      throw error;
    }
  }, [startTimer, endTimer]);
  
  return {
    startTimer,
    endTimer,
    recordMetric,
    trackOperation
  };
};

export default usePerformanceMonitoring; 