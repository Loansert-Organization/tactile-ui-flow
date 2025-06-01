
// Lighthouse optimization utilities for IKANISA
class LighthouseOptimizer {
  private resourceHints: Set<string> = new Set();
  private criticalResources: Set<string> = new Set();
  private lazyLoadObserver: IntersectionObserver | null = null;

  constructor() {
    this.initializeLazyLoading();
    this.optimizeImages();
    this.prefetchCriticalResources();
  }

  // Preload critical resources
  preloadResource(href: string, as: string, crossorigin?: string) {
    if (this.resourceHints.has(href)) return;
    
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = as;
    if (crossorigin) link.crossOrigin = crossorigin;
    
    document.head.appendChild(link);
    this.resourceHints.add(href);
  }

  // Prefetch likely-to-be-needed resources
  prefetchResource(href: string) {
    if (this.resourceHints.has(href)) return;
    
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    
    document.head.appendChild(link);
    this.resourceHints.add(href);
  }

  // DNS prefetch for external domains
  dnsPrefetch(domain: string) {
    if (this.resourceHints.has(domain)) return;
    
    const link = document.createElement('link');
    link.rel = 'dns-prefetch';
    link.href = domain;
    
    document.head.appendChild(link);
    this.resourceHints.add(domain);
  }

  // Optimize critical rendering path
  private prefetchCriticalResources() {
    // Preload critical fonts
    this.preloadResource('/fonts/inter.woff2', 'font', 'anonymous');
    
    // Preconnect to external domains
    this.dnsPrefetch('https://fonts.googleapis.com');
    this.dnsPrefetch('https://fonts.gstatic.com');
    
    // Prefetch likely next pages
    this.prefetchResource('/baskets');
    this.prefetchResource('/feed');
  }

  // Initialize image lazy loading with Intersection Observer
  private initializeLazyLoading() {
    if ('IntersectionObserver' in window) {
      this.lazyLoadObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement;
              this.loadImage(img);
              this.lazyLoadObserver?.unobserve(img);
            }
          });
        },
        {
          rootMargin: '50px 0px', // Start loading 50px before the image enters viewport
          threshold: 0.01
        }
      );
    }
  }

  // Optimized image loading
  loadImage(img: HTMLImageElement) {
    if (img.dataset.src) {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    }
    
    if (img.dataset.srcset) {
      img.srcset = img.dataset.srcset;
      img.removeAttribute('data-srcset');
    }
    
    img.classList.remove('lazy');
    img.classList.add('loaded');
  }

  // Register image for lazy loading
  registerLazyImage(img: HTMLImageElement) {
    if (this.lazyLoadObserver) {
      img.classList.add('lazy');
      this.lazyLoadObserver.observe(img);
    } else {
      // Fallback for browsers without IntersectionObserver
      this.loadImage(img);
    }
  }

  // Optimize images with modern formats and responsive sizing
  private optimizeImages() {
    // Add WebP support detection
    const webpSupported = this.supportsWebP();
    if (webpSupported) {
      document.documentElement.classList.add('webp-supported');
    }
  }

  private supportsWebP(): boolean {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').startsWith('data:image/webp');
  }

  // Reduce layout shifts
  setImageDimensions(img: HTMLImageElement, width: number, height: number) {
    img.width = width;
    img.height = height;
    img.style.aspectRatio = `${width} / ${height}`;
  }

  // Optimize fonts loading
  optimizeFonts() {
    // Use font-display: swap for better LCP
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: 'Inter';
        font-display: swap;
        src: url('/fonts/inter.woff2') format('woff2');
      }
    `;
    document.head.appendChild(style);
  }

  // Service Worker optimization
  optimizeServiceWorker() {
    if ('serviceWorker' in navigator) {
      // Skip waiting for faster updates
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });
    }
  }

  // Reduce JavaScript bundle size impact
  deferNonCriticalJS() {
    const scripts = document.querySelectorAll('script[defer-load]');
    
    // Load deferred scripts after main content is loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.loadDeferredScripts(scripts);
      });
    } else {
      this.loadDeferredScripts(scripts);
    }
  }

  private loadDeferredScripts(scripts: NodeListOf<Element>) {
    scripts.forEach((script) => {
      const newScript = document.createElement('script');
      newScript.src = script.getAttribute('defer-load') || '';
      newScript.async = true;
      document.head.appendChild(newScript);
    });
  }

  // Performance budget monitoring
  checkPerformanceBudget() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        
        entries.forEach((entry) => {
          if (entry.entryType === 'resource') {
            const resourceEntry = entry as PerformanceResourceTiming;
            const size = resourceEntry.transferSize || 0;
            
            // Warn about large resources
            if (size > 250 * 1024) { // 250KB
              console.warn(`[Lighthouse] Large resource detected: ${entry.name} (${(size / 1024).toFixed(2)}KB)`);
            }
          }
        });
      });
      
      observer.observe({ entryTypes: ['resource'] });
    }
  }

  // Generate Lighthouse optimization report
  generateOptimizationReport(): string {
    let report = '\n=== Lighthouse Optimization Report ===\n';
    
    report += '\n✅ Implemented Optimizations:\n';
    report += '• Resource preloading and prefetching\n';
    report += '• Image lazy loading with Intersection Observer\n';
    report += '• WebP format support detection\n';
    report += '• Font optimization with font-display: swap\n';
    report += '• DNS prefetching for external domains\n';
    report += '• Performance budget monitoring\n';
    report += '• Deferred non-critical JavaScript loading\n';
    
    report += '\n📊 Current Status:\n';
    report += `• Resource hints added: ${this.resourceHints.size}\n`;
    report += `• Lazy loading observer: ${this.lazyLoadObserver ? 'Active' : 'Not supported'}\n`;
    report += `• WebP support: ${this.supportsWebP() ? 'Yes' : 'No'}\n`;
    
    report += '\n💡 Additional Recommendations:\n';
    report += '• Enable gzip/brotli compression on server\n';
    report += '• Implement Critical CSS inlining\n';
    report += '• Use CDN for static assets\n';
    report += '• Optimize bundle splitting\n';
    report += '• Minimize main thread work\n';
    
    return report;
  }

  // Cleanup method
  cleanup() {
    if (this.lazyLoadObserver) {
      this.lazyLoadObserver.disconnect();
    }
  }
}

export const lighthouseOptimizer = new LighthouseOptimizer();
