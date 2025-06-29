// Auto-generated shim for analytics service
export const analyticsService = {
  trackEvent: (eventName: string, properties?: Record<string, any>) => {
    console.log('Analytics:', eventName, properties);
  },
  
  trackPageView: (path: string) => {
    console.log('Page view:', path);
  },
  
  trackError: (error: string, context?: string) => {
    console.error('Error tracked:', error, context);
  },
  
  setUserId: (userId: string) => {
    console.log('User ID set:', userId);
  },
  
  reset: () => {
    console.log('Analytics reset');
  }
};

export default analyticsService; 