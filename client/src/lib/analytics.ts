// Analytics event names
export const AnalyticsEvent = {
  // Movie related events
  'movie_view': 'movie_view',
  'movie_favorite': 'movie_favorite',
  'movie_unfavorite': 'movie_unfavorite',
  'movie_search': 'movie_search',
  'movie_random': 'movie_random',
  
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

// Analytics event tracking function
export function trackEvent(eventName: keyof typeof AnalyticsEvent, params?: AnalyticsParams) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
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
  trackEvent('movie_view', {
    movie_id: movieId,
    movie_title: movieTitle,
  });
}

// Movie favorite tracking
export function trackMovieFavorite(movieId: number, movieTitle: string) {
  trackEvent('movie_favorite', {
    movie_id: movieId,
    movie_title: movieTitle,
  });
}

// Movie unfavorite tracking
export function trackMovieUnfavorite(movieId: number, movieTitle: string) {
  trackEvent('movie_unfavorite', {
    movie_id: movieId,
    movie_title: movieTitle,
  });
}

// Movie search tracking
export function trackMovieSearch(query: string, resultCount: number) {
  trackEvent('movie_search', {
    search_query: query,
    result_count: resultCount,
  });
}

// Random movie tracking
export function trackRandomMovie(movieId: number, movieTitle: string) {
  trackEvent('movie_random', {
    movie_id: movieId,
    movie_title: movieTitle,
  });
}

// Theme toggle tracking
export function trackThemeToggle(theme: 'light' | 'dark') {
  trackEvent('theme_toggle', {
    theme,
  });
}

// Language change tracking
export function trackLanguageChange(language: string) {
  trackEvent('language_change', {
    language,
  });
}

// Streaming click tracking
export function trackStreamingClick(provider: string, movieId: number, movieTitle: string) {
  trackEvent('streaming_click', {
    provider,
    movie_id: movieId,
    movie_title: movieTitle,
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