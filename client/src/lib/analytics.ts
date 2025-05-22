// Analytics event names
export const AnalyticsEvent = {
  // Movie related events
  'movie_view': 'movie_view',
  'movie_favorite': 'movie_favorite',
  'movie_unfavorite': 'movie_unfavorite',
  'movie_search': 'movie_search',
  'movie_random': 'movie_random',
  'movie_share': 'movie_share',
  
  // Navigation events
  'page_view': 'page_view',
  'navigation': 'navigation',
  
  // User interaction events
  'theme_toggle': 'theme_toggle',
  'language_change': 'language_change',
  
  // Streaming events
  'streaming_click': 'streaming_click',
} as const;

// Analytics event parameters
export interface AnalyticsParams {
  [key: string]: string | number | boolean | undefined;
}

type AnalyticsEventType = typeof AnalyticsEvent[keyof typeof AnalyticsEvent];

interface AnalyticsEventProperties {
  movie_id?: number;
  movie_title?: string;
  platform?: string;
  timestamp?: string;
  provider?: string;
  query?: string;
  page?: string;
  theme?: string;
  language?: string;
  [key: string]: any;
}

export function trackEvent(event: { name: AnalyticsEventType; properties: AnalyticsEventProperties }) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', event.name, event.properties);
  }
}

// Page view tracking
export function trackPageView(url: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', AnalyticsEvent['page_view'], {
      page_path: url,
      page_title: document.title,
    });
  }
}

// Movie view tracking
export function trackMovieView(movieId: number, movieTitle: string) {
  trackEvent({
    name: AnalyticsEvent.movie_view,
    properties: {
      movie_id: movieId,
      movie_title: movieTitle,
    }
  });
}

// Movie favorite tracking
export function trackMovieFavorite(movieId: number, movieTitle: string) {
  trackEvent({
    name: AnalyticsEvent.movie_favorite,
    properties: {
      movie_id: movieId,
      movie_title: movieTitle,
    }
  });
}

// Movie unfavorite tracking
export function trackMovieUnfavorite(movieId: number, movieTitle: string) {
  trackEvent({
    name: AnalyticsEvent.movie_unfavorite,
    properties: {
      movie_id: movieId,
      movie_title: movieTitle,
    }
  });
}

// Movie search tracking
export function trackMovieSearch(query: string, resultCount: number) {
  trackEvent({
    name: AnalyticsEvent.movie_search,
    properties: {
      search_query: query,
      result_count: resultCount,
    }
  });
}

// Random movie tracking
export function trackRandomMovie(movieId: number, movieTitle: string) {
  trackEvent({
    name: AnalyticsEvent.movie_random,
    properties: {
      movie_id: movieId,
      movie_title: movieTitle,
    }
  });
}

// Theme toggle tracking
export function trackThemeToggle(theme: 'light' | 'dark') {
  trackEvent({
    name: AnalyticsEvent.theme_toggle,
    properties: {
      theme,
    }
  });
}

// Language change tracking
export function trackLanguageChange(language: string) {
  trackEvent({
    name: AnalyticsEvent.language_change,
    properties: {
      language,
    }
  });
}

// Streaming click tracking
export function trackStreamingClick(provider: string, movieId: number, movieTitle: string) {
  trackEvent({
    name: AnalyticsEvent.streaming_click,
    properties: {
      provider,
      movie_id: movieId,
      movie_title: movieTitle,
    }
  });
}

// Movie share tracking
export function trackMovieShare(movieId: number, movieTitle: string, platform: string) {
  trackEvent({
    name: AnalyticsEvent.movie_share,
    properties: {
      movie_id: movieId,
      movie_title: movieTitle,
      platform: platform,
      timestamp: new Date().toISOString()
    }
  });
}

// Add TypeScript declaration for gtag
declare global {
  interface Window {
    gtag: (
      command: 'event' | 'js' | 'config',
      action: string,
      params?: Record<string, any>
    ) => void;
  }
} 