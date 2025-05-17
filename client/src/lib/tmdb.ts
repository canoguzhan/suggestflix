import { TmdbMovie } from "@shared/schema";
import { detectLanguage } from "./localization";

// Query configuration for fetching a random movie
export const randomMovieQuery = () => {
  const language = detectLanguage();
  return {
    queryKey: ["/api/movies/random", language],
    queryFn: async () => {
      const res = await fetch(`/api/movies/random?language=${language}`);
      if (!res.ok) {
        throw new Error("Failed to fetch random movie");
      }
      return res.json();
    }
  };
};

// Query configuration for fetching movie history
export const historyQuery = () => ({
  queryKey: ["/api/movies/history"],
});

// Query configuration for fetching favorites
export const favoritesQuery = () => ({
  queryKey: ["/api/movies/favorites"],
});

// Helper function to get TMDB image URL
export const getTmdbImageUrl = (path: string | null, size: string = "w500") => {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

// Helper function to get localized TMDB movie URL
export const getTmdbMovieUrl = (id: number, language: string) => {
  const langPath = language === 'en' ? '' : `/${language}`;
  return `https://www.themoviedb.org${langPath}/movie/${id}`;
};
