// Performance utilities for code splitting and lazy loading

import { lazy, Suspense, ComponentType, ReactNode } from 'react';

// Loading fallback component
export const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

// Error fallback component
export const ErrorFallback = ({ error }: { error: Error }) => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="text-center">
      <h1 className="text-2xl font-bold text-red-600 mb-4">Component Failed to Load</h1>
      <p className="text-gray-600">{error.message}</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-4 bg-primary text-white px-4 py-2 rounded"
      >
        Reload Page
      </button>
    </div>
  </div>
);

// Lazy load wrapper with error boundary
export const lazyLoad = <T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: ReactNode
) => {
  const Component = lazy(importFunc);
  return (props: any) => (
    <Suspense fallback={fallback || <LoadingSpinner />}>
      <Component {...props} />
    </Suspense>
  );
};

// Preload a component (for routes user is likely to visit)
export const preloadComponent = (importFunc: () => Promise<any>) => {
  const preload = () => importFunc();
  return preload;
};

// Performance monitoring
export const measureComponentRender = (componentName: string) => {
  return (Component: ComponentType<any>) => {
    return (props: any) => {
      React.useEffect(() => {
        const startTime = performance.now();
        return () => {
          const endTime = performance.now();
          console.debug(
            `[Performance] ${componentName} rendered in ${(endTime - startTime).toFixed(2)}ms`
          );
        };
      }, []);

      return <Component {...props} />;
    };
  };
};

// Intersection Observer for lazy image loading
export const LazyImage = ({ src, alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => {
  const [imageSrc, setImageSrc] = React.useState<string | undefined>();
  const [ref, setRef] = React.useState<HTMLImageElement | null>(null);

  React.useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setImageSrc(src);
            observer.unobserve(ref);
          }
        });
      },
      { rootMargin: '50px' }
    );

    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref, src]);

  return (
    <img
      ref={setRef}
      src={imageSrc}
      alt={alt}
      style={{ ...props.style, opacity: imageSrc ? 1 : 0.5 }}
      {...props}
    />
  );
};

// Request idle callback wrapper
export const runWhenIdle = (callback: () => void, timeout = 2000) => {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(callback, { timeout });
  } else {
    setTimeout(callback, timeout);
  }
};

// Debounced search for reducing API calls
export const createDebouncedSearch = <T extends any[], R>(
  searchFn: (...args: T) => Promise<R>,
  delay = 300
) => {
  let timeoutId: NodeJS.Timeout;

  return (...args: T): Promise<R> => {
    return new Promise((resolve, reject) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(async () => {
        try {
          const result = await searchFn(...args);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }, delay);
    });
  };
};

// Query result caching
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

export class QueryCache {
  private cache = new Map<string, CacheEntry<any>>();

  set<T>(key: string, data: T, ttlMs = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMs,
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > entry.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  clear(): void {
    this.cache.clear();
  }

  invalidate(pattern: string): void {
    const regex = new RegExp(pattern);
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }
}

export const queryCache = new QueryCache();

// Virtual scrolling helper for large lists
export const useVirtualScroll = (
  itemCount: number,
  itemHeight: number,
  containerHeight: number,
  buffer = 5
) => {
  const [scrollTop, setScrollTop] = React.useState(0);

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - buffer);
  const endIndex = Math.min(
    itemCount,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + buffer
  );

  const offsetY = startIndex * itemHeight;

  return {
    startIndex,
    endIndex,
    offsetY,
    onScroll: (e: React.UIEvent<HTMLDivElement>) => {
      setScrollTop(e.currentTarget.scrollTop);
    },
    visibleItems: endIndex - startIndex,
  };
};

// Bundle analysis helper
export const logBundleSize = () => {
  const log = () => {
    const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    console.log('Performance Metrics:', {
      dns: perfData.domainLookupEnd - perfData.domainLookupStart,
      tcp: perfData.connectEnd - perfData.connectStart,
      ttfb: perfData.responseStart - perfData.requestStart,
      download: perfData.responseEnd - perfData.responseStart,
      domInteractive: perfData.domInteractive - perfData.fetchStart,
      domComplete: perfData.domComplete - perfData.fetchStart,
      loadComplete: perfData.loadEventEnd - perfData.fetchStart,
    });
  };

  if (document.readyState === 'complete') {
    log();
  } else {
    window.addEventListener('load', log);
  }
};
