import { TmdbMovie } from "@shared/schema";

export interface StreamingService {
  name: string;
  icon: string;
  searchUrl: string;
  color: string;
}

// Define major streaming services
export const streamingServices: StreamingService[] = [
  {
    name: 'Netflix',
    icon: 'netflix',
    searchUrl: 'https://www.netflix.com/search?q=',
    color: '#E50914'
  },
  {
    name: 'Amazon Prime',
    icon: 'amazon',
    searchUrl: 'https://www.amazon.com/s?k=',
    color: '#00A8E1'
  },
  {
    name: 'Disney+',
    icon: 'disney',
    searchUrl: 'https://www.disneyplus.com/search?q=',
    color: '#1F3D7C'
  },
  {
    name: 'Hulu',
    icon: 'hulu',
    searchUrl: 'https://www.hulu.com/search?q=',
    color: '#1CE783'
  },
  {
    name: 'HBO Max',
    icon: 'hbo',
    searchUrl: 'https://www.hbomax.com/search?q=',
    color: '#5822B4'
  },
  {
    name: 'Apple TV+',
    icon: 'apple',
    searchUrl: 'https://tv.apple.com/search?term=',
    color: '#000000'
  },
  {
    name: 'YouTube',
    icon: 'youtube',
    searchUrl: 'https://www.youtube.com/results?search_query=',
    color: '#FF0000'
  }
];

// Function to get streaming service links for a movie
export function getStreamingLinks(movie: TmdbMovie): StreamingService[] {
  // In a real app, you might use an API to determine actual availability
  // For now, we'll return all streaming services for demonstration
  return streamingServices;
}

// Function to encode movie title for search URLs
export function encodeMovieTitle(title: string): string {
  return encodeURIComponent(`${title} movie`);
}

// Function to get the full search URL for a movie on a streaming platform
export function getStreamingSearchUrl(service: StreamingService, movie: TmdbMovie): string {
  return `${service.searchUrl}${encodeMovieTitle(movie.title)}`;
}