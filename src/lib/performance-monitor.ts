
// Performance monitoring and analytics for IKANISA
class PerformanceMonitor {
  private metrics: Map<string, number> = new Map();
  private startTimes: Map<string, number> = new Map();
  private observer: PerformanceObserver | null = null;

  constructor() {
    this.initializePerformanceObserver();
    this.monitorCoreWebVitals();
  }

  // Initialize Performance Observer for automated monitoring
  private initializePerformanceObserver() {
    if ('PerformanceObserver' in window) {
      this.observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.handlePerformanceEntry(entry);
        }
      });

      // Observe navigation, paint, and measure entries
      try {
        this.observer.observe({ entryTypes: ['navigation', 'paint', 'measure', 'resource'] });
      } catch (error) {
        console.warn('[Performance] Observer not supported for some entry types');
      }
    }
  }

  // Monitor Core Web Vitals
  private monitorCoreWebVitals() {
    // First Contentful Paint (FCP)
    this.measurePaint('first-contentful-paint');
    
    // Largest Contentful Paint (LCP)
    this.measurePaint('largest-contentful-paint');

    // Cumulative Layout Shift (CLS)
    this.measureLayoutShift();

    // First Input Delay (FID) / Interaction to Next Paint (INP)
    this.measureInteractionDelay();
  }

  private measurePaint(paintType: string) {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === paintType) {
            this.recordMetric(paintType, entry.startTime);
            observer.disconnect();
          }
        }
      });
      observer.observe({ entryTypes: ['paint'] });
    }
  }

  private measureLayoutShift() {
    if ('PerformanceObserver' in window) {
      let cumulativeScore = 0;
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            cumulativeScore += (entry as any).value;
          }
        }
        this.recordMetric('cumulative-layout-shift', cumulativeScore);
      });
      
      try {
        observer.observe({ entryTypes: ['layout-shift'] });
      } catch (error) {
        console.warn('[Performance] Layout shift monitoring not supported');
      }
    }
  }

  private measureInteractionDelay() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const delay = (entry as any).processingStart - entry.startTime;
          this.recordMetric('interaction-delay', delay);
        }
      });
      
      try {
        observer.observe({ entryTypes: ['first-input'] });
      } catch (error) {
        console.warn('[Performance] First input monitoring not supported');
      }
    }
  }

  private handlePerformanceEntry(entry: PerformanceEntry) {
    switch (entry.entryType) {
      case 'navigation':
        this.handleNavigationEntry(entry as PerformanceNavigationTiming);
        break;
      case 'resource':
        this.handleResourceEntry(entry as PerformanceResourceTiming);
        break;
    }
  }

  private handleNavigationEntry(entry: PerformanceNavigationTiming) {
    this.recordMetric('dom-content-loaded', entry.domContentLoadedEventEnd - entry.navigationStart);
    this.recordMetric('load-complete', entry.loadEventEnd - entry.navigationStart);
    this.recordMetric('time-to-interactive', entry.domInteractive - entry.navigationStart);
  }

  private handleResourceEntry(entry: PerformanceResourceTiming) {
    const duration = entry.responseEnd - entry.startTime;
    const resourceType = this.getResourceType(entry.name);
    
    if (resourceType) {
      this.recordMetric(`${resourceType}-load-time`, duration);
    }
  }

  private getResourceType(url: string): string | null {
    if (url.match(/\.(js|jsx|ts|tsx)$/)) return 'script';
    if (url.match(/\.(css)$/)) return 'stylesheet';
    if (url.match(/\.(png|jpg|jpeg|gif|webp|svg)$/)) return 'image';
    if (url.match(/\.(woff|woff2|ttf|eot)$/)) return 'font';
    return null;
  }

  // Public API methods
  startMeasurement(name: string) {
    this.startTimes.set(name, performance.now());
  }

  endMeasurement(name: string) {
    const startTime = this.startTimes.get(name);
    if (startTime) {
      const duration = performance.now() - startTime;
      this.recordMetric(name, duration);
      this.startTimes.delete(name);
      
      // Create performance mark for browser dev tools
      if ('performance' in window && 'mark' in performance) {
        performance.mark(`${name}-end`);
        performance.measure(name, `${name}-start`, `${name}-end`);
      }
    }
  }

  recordMetric(name: string, value: number) {
    this.metrics.set(name, value);
    console.log(`[Performance] ${name}: ${value.toFixed(2)}ms`);
    
    // Store in localStorage for persistence
    try {
      const stored = JSON.parse(localStorage.getItem('ikanisa-performance') || '{}');
      stored[name] = value;
      stored.timestamp = Date.now();
      localStorage.setItem('ikanisa-performance', JSON.stringify(stored));
    } catch (error) {
      console.warn('[Performance] Failed to store metrics');
    }
  }

  getMetrics(): Record<string, number> {
    return Object.fromEntries(this.metrics);
  }

  generateReport(): string {
    const metrics = this.getMetrics();
    let report = '\n=== IKANISA Performance Report ===\n';
    
    // Core Web Vitals
    report += '\nCore Web Vitals:\n';
    if (metrics['first-contentful-paint']) {
      report += `• FCP: ${metrics['first-contentful-paint'].toFixed(2)}ms\n`;
    }
    if (metrics['largest-contentful-paint']) {
      report += `• LCP: ${metrics['largest-contentful-paint'].toFixed(2)}ms\n`;
    }
    if (metrics['cumulative-layout-shift']) {
      report += `• CLS: ${metrics['cumulative-layout-shift'].toFixed(3)}\n`;
    }
    
    // Loading Performance
    report += '\nLoading Performance:\n';
    if (metrics['dom-content-loaded']) {
      report += `• DOM Content Loaded: ${metrics['dom-content-loaded'].toFixed(2)}ms\n`;
    }
    if (metrics['load-complete']) {
      report += `• Load Complete: ${metrics['load-complete'].toFixed(2)}ms\n`;
    }
    
    return report;
  }

  // Lighthouse optimization recommendations
  getLighthouseRecommendations(): string[] {
    const recommendations: string[] = [];
    const metrics = this.getMetrics();

    if (metrics['first-contentful-paint'] > 2000) {
      recommendations.push('Consider optimizing critical rendering path - FCP is high');
    }
    
    if (metrics['largest-contentful-paint'] > 2500) {
      recommendations.push('Optimize images and reduce server response times - LCP is high');
    }
    
    if (metrics['cumulative-layout-shift'] > 0.1) {
      recommendations.push('Reduce layout shifts by setting dimensions on images and ads');
    }

    return recommendations;
  }
}

export const performanceMonitor = new PerformanceMonitor();
