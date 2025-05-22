// Performance API type declarations
interface PerformanceMemory {
  totalJSHeapSize: number;
  usedJSHeapSize: number;
  jsHeapSizeLimit: number;
}

interface NetworkInformation extends EventTarget {
  readonly effectiveType: 'slow-2g' | '2g' | '3g' | '4g';
  readonly downlink: number;
  readonly rtt: number;
  readonly saveData: boolean;
  onchange: EventListener;
}

interface PerformanceEventTiming extends PerformanceEntry {
  interactionId?: number;
  target?: Element;
  cancelable?: boolean;
}

interface LayoutShift extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
  lastInputTime: number;
  sources: Array<{
    node?: Node;
    currentRect?: DOMRectReadOnly;
    previousRect?: DOMRectReadOnly;
  }>;
}

interface PerformanceElementTiming extends PerformanceEntry {
  identifier: string;
  element: Element;
  url?: string;
  loadTime: number;
  renderTime: number;
  naturalWidth?: number;
  naturalHeight?: number;
  intrinsicSize?: number;
  id?: string;
}

// Extend Window interface
interface Window {
  gtag: (command: string, action: string, params?: any) => void;
  performance: Performance & {
    memory?: PerformanceMemory;
  };
  navigator: Navigator & {
    connection?: NetworkInformation;
  };
} 