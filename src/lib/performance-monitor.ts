
// Helper functions (stubs)
async function compressData(data: any) { return data; }
function loadImage(img: HTMLImageElement) {
  if (img.dataset.src) img.src = img.dataset.src;
}

// Performance monitoring utility with placeholder implementations
export const performanceMonitor = {
  startMeasurement: (name: string) => {
    console.log(`Starting measurement: ${name}`);
    if (typeof performance !== 'undefined' && performance.mark) {
      performance.mark(`${name}-start`);
    }
  },
  
  endMeasurement: (name: string) => {
    console.log(`Ending measurement: ${name}`);
    if (typeof performance !== 'undefined' && performance.mark && performance.measure) {
      performance.mark(`${name}-end`);
      try {
        performance.measure(name, `${name}-start`, `${name}-end`);
      } catch (error) {
        console.warn(`Could not measure ${name}:`, error);
      }
    }
  },
  
  getMeasurements: () => {
    if (typeof performance !== 'undefined' && performance.getEntriesByType) {
      return performance.getEntriesByType('measure');
    }
    return [];
  },
  
  clearMeasurements: () => {
    if (typeof performance !== 'undefined' && performance.clearMeasures) {
      performance.clearMeasures();
    }
  },

  getMetrics: () => {
    // Return placeholder metrics for Core Web Vitals
    const metrics: Record<string, number> = {
      'first-contentful-paint': 1200,
      'largest-contentful-paint': 2500,
      'cumulative-layout-shift': 0.1,
      'time-to-interactive': 3000
    };

    // Try to get real navigation timing if available
    if (typeof performance !== 'undefined' && performance.getEntriesByType) {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        // Use correct properties for PerformanceNavigationTiming
        metrics['navigation-start'] = navigation.startTime;
        metrics['dom-complete'] = navigation.domComplete - navigation.startTime;
        metrics['load-complete'] = navigation.loadEventEnd - navigation.startTime;
        
        // Only use responseStart if it exists
        if (navigation.responseStart) {
          metrics['response-time'] = navigation.responseStart - navigation.startTime;
        }
      }
    }

    return metrics;
  },

  generateReport: () => {
    const metrics = performanceMonitor.getMetrics();
    let report = '=== Performance Report ===\n';
    report += `First Contentful Paint: ${metrics['first-contentful-paint']}ms\n`;
    report += `Largest Contentful Paint: ${metrics['largest-contentful-paint']}ms\n`;
    report += `Cumulative Layout Shift: ${metrics['cumulative-layout-shift']}\n`;
    report += `Time to Interactive: ${metrics['time-to-interactive']}ms\n`;
    
    if (metrics['dom-complete']) {
      report += `DOM Complete: ${metrics['dom-complete']}ms\n`;
    }
    if (metrics['load-complete']) {
      report += `Load Complete: ${metrics['load-complete']}ms\n`;
    }
    
    return report;
  }
};
