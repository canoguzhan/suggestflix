import React from "react";
import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import MovieCard from "@/components/movie-card";
import { TmdbMovie } from "@shared/schema";
import { useTranslation } from "@/lib/localization";
import { trackMovieView } from "@/lib/analytics";

export default function MoviePage() {
  const [, params] = useRoute<{ id: string }>("/movie/:id");
  const { t } = useTranslation();
  const movieId = parseInt(params?.id || "0", 10);

  // Fetch movie details
  const { data: movie, isLoading, isError } = useQuery({
    queryKey: ["/api/movies", movieId],
    queryFn: async () => {
      const res = await fetch(`/api/movies/${movieId}`);
      if (!res.ok) {
        throw new Error("Failed to fetch movie");
      }
      return res.json();
    },
    enabled: !!movieId,
  });

  // Track movie view
  React.useEffect(() => {
    if (movie) {
      trackMovieView(movie.id, movie.title);
    }
  }, [movie]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (isError || !movie) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-4">{t('error.title')}</h2>
        <p className="text-accent">{t('error.message')}</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`${movie.title} - SuggestFlix`}</title>
        <meta name="description" content={movie.overview} />
        <link rel="canonical" href={`https://suggestflix.com/movie/${movie.id}`} />
        <meta property="og:title" content={movie.title} />
        <meta property="og:description" content={movie.overview} />
        {movie.poster_path && (
          <meta property="og:image" content={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} />
        )}
        <meta property="og:url" content={`https://suggestflix.com/movie/${movie.id}`} />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <div className="container mx-auto px-4 py-8">
        <MovieCard
          movie={{
            ...movie as TmdbMovie,
            storedId: movieId
          }}
        />
      </div>
    </>
  );
} 