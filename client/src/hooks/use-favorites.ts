import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

interface UseFavoritesOptions {
  enabled?: boolean;
}

export function useFavorites(options: UseFavoritesOptions = {}) {
  const { enabled = true } = options;
  
  // Fetch favorites from API
  const { 
    data: favoritesData,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ["/api/movies/favorites"],
    enabled,
  });
  
  // Check if a movie is favorited
  const isFavorite = (movieId: number) => {
    if (!favoritesData) return false;
    return favoritesData.some((fav: any) => fav.movie?.id === movieId);
  };
  
  return {
    favorites: favoritesData,
    isLoading,
    isError,
    error,
    refetch,
    isFavorite
  };
}
