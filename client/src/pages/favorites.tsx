import React from "react";
import { useFavorites } from "@/hooks/use-favorites";
import MovieCard from "@/components/movie-card";
import { TmdbMovie } from "@shared/schema";

export default function Favorites() {
  const { favorites, isLoading, isError } = useFavorites();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Error loading favorites</h2>
        <p className="text-accent">Please try again later.</p>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-secondary dark:text-white mb-4">No Favorites Yet</h2>
        <p className="text-accent">Start adding movies to your favorites list!</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-secondary dark:text-white mb-8 text-center">
        Your Favorites
      </h1>
      <div className="space-y-8">
        {favorites.map((favorite) => (
          <MovieCard
            key={favorite.movieId}
            movie={{
              ...(favorite.movie as TmdbMovie),
              storedId: favorite.movieId
            }}
          />
        ))}
      </div>
    </div>
  );
} 