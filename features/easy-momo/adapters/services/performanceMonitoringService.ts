// Auto-generated shim for performance monitoring service
export const performanceMonitoringService = {
  recordMetric: (name: string, value: number, tags?: Record<string, string>) => {
    console.log('Performance Metric:', name, value, tags);
  },
  
  startTimer: (name: string): string => {
    const timerId = 'timer_' + Date.now();
    console.log('Performance Timer Started:', name, timerId);
    return timerId;
  },
  
  endTimer: (timerId: string, name: string): number => {
    console.log('Performance Timer Ended:', name, timerId);
    return 100; // Mock duration
  },
  
  trackPageLoad: (page: string, loadTime: number) => {
    console.log('Performance Page Load:', page, loadTime);
  },
  
  trackApiCall: (endpoint: string, duration: number, success: boolean) => {
    console.log('Performance API Call:', endpoint, duration, success);
  },
  
  getMetrics: (): any[] => {
    return [];
  }
};

export default performanceMonitoringService;
