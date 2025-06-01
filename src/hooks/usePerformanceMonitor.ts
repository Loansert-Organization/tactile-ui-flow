
import { useEffect, useCallback } from 'react';

interface PerformanceMetrics {
  fcp?: number; // First Contentful Paint
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  ttfb?: number; // Time to First Byte
}

export const usePerformanceMonitor = () => {
  const reportMetric = useCallback((name: string, value: number) => {
    // In production, send to analytics
    console.log(`[Performance] ${name}: ${Math.round(value)}ms`);
    
    // You can integrate with analytics services here
    // gtag('event', 'web_vitals', { name, value });
  }, []);

  useEffect(() => {
    // Monitor Core Web Vitals
    if ('PerformanceObserver' in window) {
      // First Contentful Paint & Largest Contentful Paint
      const paintObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          if (entry.name === 'first-contentful-paint') {
            reportMetric('FCP', entry.startTime);
          }
        });
      });

      const lcpObserver = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          reportMetric('LCP', entry.startTime);
        });
      });

      // Cumulative Layout Shift
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        list.getEntries().forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
        reportMetric('CLS', clsValue * 1000); // Convert to ms for consistency
      });

      try {
        paintObserver.observe({ entryTypes: ['paint'] });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (error) {
        console.warn('[Performance] Some observers not supported:', error);
      }

      return () => {
        paintObserver.disconnect();
        lcpObserver.disconnect();
        clsObserver.disconnect();
      };
    }
  }, [reportMetric]);

  // Measure custom timing
  const measureTiming = useCallback((name: string, fn: () => void | Promise<void>) => {
    const start = performance.now();
    
    const result = fn();
    
    if (result instanceof Promise) {
      return result.finally(() => {
        const duration = performance.now() - start;
        reportMetric(name, duration);
      });
    } else {
      const duration = performance.now() - start;
      reportMetric(name, duration);
      return result;
    }
  }, [reportMetric]);

  // Get network information
  const getNetworkInfo = useCallback(() => {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      return {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData
      };
    }
    return null;
  }, []);

  return {
    measureTiming,
    getNetworkInfo,
    reportMetric
  };
};

// Hook for monitoring component render performance
export const useRenderPerformance = (componentName: string) => {
  const { measureTiming } = usePerformanceMonitor();

  useEffect(() => {
    const start = performance.now();
    
    return () => {
      const duration = performance.now() - start;
      console.log(`[Render] ${componentName}: ${Math.round(duration)}ms`);
    };
  }, [componentName, measureTiming]);
};
