// Performance monitoring utility
interface PerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
  navigationTiming: PerformanceNavigationTiming;
  resourceTiming: ResourceTiming[];
  memoryUsage?: PerformanceMemory;
  networkInfo?: NetworkInformation;
  componentTiming: ComponentTiming[];
  apiTiming: ApiTiming[];
  routeTiming: RouteTiming[];
}

interface ResourceTiming {
  name: string;
  duration: number;
  transferSize: number;
  initiatorType: string;
  startTime: number;
  responseEnd: number;
}

interface ComponentTiming {
  name: string;
  renderTime: number;
  mountTime: number;
  updateCount: number;
  lastUpdate: number;
}

interface ApiTiming {
  url: string;
  method: string;
  duration: number;
  status: number;
  timestamp: number;
  cacheStatus: 'hit' | 'miss' | 'stale';
}

interface RouteTiming {
  from: string;
  to: string;
  duration: number;
  timestamp: number;
  resourcesLoaded: number;
}

// Initialize performance monitoring
export function initPerformanceMonitoring() {
  if (typeof window === 'undefined') return;

  // Report metrics to analytics
  const reportMetrics = (metrics: Partial<PerformanceMetrics>) => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'performance_metrics', metrics);
    }
  };

  // Track First Contentful Paint
  new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries();
    if (entries.length > 0) {
      const fcp = entries[0].startTime;
      reportMetrics({ fcp });
    }
  }).observe({ entryTypes: ['paint'] });

  // Track Largest Contentful Paint
  new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries();
    if (entries.length > 0) {
      const lcp = entries[entries.length - 1].startTime;
      reportMetrics({ lcp });
    }
  }).observe({ entryTypes: ['largest-contentful-paint'] });

  // Track First Input Delay
  new PerformanceObserver((entryList) => {
    const entries = entryList.getEntries();
    entries.forEach(entry => {
      const firstInput = entry as PerformanceEventTiming;
      if (firstInput.interactionId) {
        const fid = firstInput.duration;
        reportMetrics({ fid });
      }
    });
  }).observe({ entryTypes: ['first-input'] });

  // Track Cumulative Layout Shift
  new PerformanceObserver((entryList) => {
    let cls = 0;
    entryList.getEntries().forEach(entry => {
      const layoutShift = entry as LayoutShift;
      if (!layoutShift.hadRecentInput) {
        cls += layoutShift.value;
      }
    });
    reportMetrics({ cls });
  }).observe({ entryTypes: ['layout-shift'] });

  // Track Time to First Byte
  const navigationTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
  if (navigationTiming) {
    const ttfb = navigationTiming.responseStart - navigationTiming.requestStart;
    reportMetrics({ ttfb, navigationTiming });
  }

  // Track resource timing with enhanced metrics
  new PerformanceObserver((entryList) => {
    const resourceTimings: ResourceTiming[] = entryList.getEntries().map(entry => {
      const resourceEntry = entry as PerformanceResourceTiming;
      return {
        name: resourceEntry.name,
        duration: resourceEntry.duration,
        transferSize: resourceEntry.transferSize,
        initiatorType: resourceEntry.initiatorType,
        startTime: resourceEntry.startTime,
        responseEnd: resourceEntry.responseEnd
      };
    });

    reportMetrics({ resourceTiming: resourceTimings });
  }).observe({ entryTypes: ['resource'] });

  // Track memory usage if available
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    reportMetrics({ memoryUsage: memory });
  }

  // Track network information if available
  if ('connection' in navigator) {
    const connection = (navigator as any).connection;
    if (connection) {
      reportMetrics({ networkInfo: connection });
    }
  }

  // Track long tasks
  new PerformanceObserver((entryList) => {
    entryList.getEntries().forEach(entry => {
      if (entry.duration > 50) {
        console.warn(`Long task detected: ${entry.duration.toFixed(2)}ms`);
      }
    });
  }).observe({ entryTypes: ['longtask'] });

  // Track element timing
  new PerformanceObserver((entryList) => {
    entryList.getEntries().forEach(entry => {
      const elementTiming = entry as PerformanceElementTiming;
      if (elementTiming.duration > 100) {
        console.warn(`Slow element render: ${elementTiming.identifier} (${elementTiming.duration.toFixed(2)}ms)`);
      }
    });
  }).observe({ entryTypes: ['element'] });
}

// Track component render performance with enhanced metrics
export function trackComponentRender(componentName: string) {
  if (typeof window === 'undefined') return;

  const startTime = performance.now();
  let mountTime = 0;
  let updateCount = 0;
  let lastUpdate = Date.now();

  return {
    onMount: () => {
      mountTime = performance.now() - startTime;
      updateCount++;
      lastUpdate = Date.now();

      const componentTiming: ComponentTiming = {
        name: componentName,
        renderTime: mountTime,
        mountTime,
        updateCount,
        lastUpdate
      };

      if (typeof window.gtag === 'function') {
        window.gtag('event', 'component_timing', componentTiming);
      }

      if (mountTime > 100) {
        console.warn(`Slow component mount detected in ${componentName}: ${mountTime.toFixed(2)}ms`);
      }
    },
    onUpdate: () => {
      const updateTime = performance.now() - startTime;
      updateCount++;
      lastUpdate = Date.now();

      const componentTiming: ComponentTiming = {
        name: componentName,
        renderTime: updateTime,
        mountTime,
        updateCount,
        lastUpdate
      };

      if (typeof window.gtag === 'function') {
        window.gtag('event', 'component_timing', componentTiming);
      }

      if (updateTime > 50) {
        console.warn(`Slow component update detected in ${componentName}: ${updateTime.toFixed(2)}ms`);
      }
    }
  };
}

// Track API performance with enhanced metrics
export function trackApiPerformance(url: string, method: string) {
  if (typeof window === 'undefined') return;

  const startTime = performance.now();
  let cacheStatus: 'hit' | 'miss' | 'stale' = 'miss';

  return {
    onStart: () => {
      // Check if request is in cache
      if ('caches' in window) {
        caches.match(url).then(cachedResponse => {
          if (cachedResponse) {
            const cacheDate = new Date(cachedResponse.headers.get('sw-cache-date') || '');
            if (Date.now() - cacheDate.getTime() < 5 * 60 * 1000) {
              cacheStatus = 'hit';
            } else {
              cacheStatus = 'stale';
            }
          }
        });
      }
    },
    onComplete: (status: number, error?: Error) => {
      const endTime = performance.now();
      const duration = endTime - startTime;

      const apiTiming: ApiTiming = {
        url,
        method,
        duration,
        status,
        timestamp: Date.now(),
        cacheStatus
      };

      if (typeof window.gtag === 'function') {
        window.gtag('event', 'api_timing', apiTiming);
      }

      if (duration > 1000) {
        console.warn(`Slow API call detected: ${method} ${url} (${duration.toFixed(2)}ms)`);
      }
    }
  };
}

// Track route change performance with enhanced metrics
export function trackRouteChange(from: string, to: string) {
  if (typeof window === 'undefined') return;

  const startTime = performance.now();
  let resourcesLoaded = 0;

  // Track resource loading during route change
  const resourceObserver = new PerformanceObserver((entryList) => {
    resourcesLoaded += entryList.getEntries().length;
  });
  resourceObserver.observe({ entryTypes: ['resource'] });

  return {
    onComplete: () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      resourceObserver.disconnect();

      const routeTiming: RouteTiming = {
        from,
        to,
        duration,
        timestamp: Date.now(),
        resourcesLoaded
      };

      if (typeof window.gtag === 'function') {
        window.gtag('event', 'route_timing', routeTiming);
      }

      if (duration > 300) {
        console.warn(`Slow route change detected: ${from} → ${to} (${duration.toFixed(2)}ms)`);
      }
    }
  };
}

// Track memory usage
export function trackMemoryUsage() {
  if (typeof window === 'undefined' || !('memory' in performance)) return;

  const memory = (performance as any).memory;
  const usage = {
    totalJSHeapSize: memory.totalJSHeapSize,
    usedJSHeapSize: memory.usedJSHeapSize,
    jsHeapSizeLimit: memory.jsHeapSizeLimit,
    timestamp: Date.now()
  };

  if (typeof window.gtag === 'function') {
    window.gtag('event', 'memory_usage', usage);
  }

  // Warn if memory usage is high
  const usagePercentage = (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100;
  if (usagePercentage > 80) {
    console.warn(`High memory usage detected: ${usagePercentage.toFixed(2)}%`);
  }

  return usage;
}

// Track network quality
export function trackNetworkQuality() {
  if (typeof window === 'undefined' || !('connection' in navigator)) return;

  const connection = (navigator as any).connection;
  if (!connection) return;

  const quality = {
    effectiveType: connection.effectiveType,
    downlink: connection.downlink,
    rtt: connection.rtt,
    saveData: connection.saveData,
    timestamp: Date.now()
  };

  if (typeof window.gtag === 'function') {
    window.gtag('event', 'network_quality', quality);
  }

  return quality;
} 