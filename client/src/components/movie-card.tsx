import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Heart, HeartOff } from "lucide-react";
import { TmdbMovie } from "@shared/schema";
import { useTranslation } from "@/lib/localization";
import StreamingLinks from "@/components/streaming-links";
import { useFavorites } from "@/hooks/use-favorites";
import { getTmdbMovieUrl } from "@/lib/tmdb";
import { trackMovieFavorite, trackMovieUnfavorite, trackStreamingClick } from "@/lib/analytics";
import { useInView } from "react-intersection-observer";

interface MovieCardProps {
  movie: TmdbMovie & { storedId: number };
}

export default function MovieCard({ movie }: MovieCardProps) {
  const { t, language } = useTranslation();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [imageLoaded, setImageLoaded] = useState(false);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  const releaseYear = movie.release_date?.split('-')[0];
  const runtime = movie.runtime;
  const genres = movie.genres?.map(g => g.name).join(', ');
  
  const handleFavoriteToggle = () => {
    const newFavoriteState = !isFavorite(movie.storedId);
    toggleFavorite(movie.storedId);
    
    if (newFavoriteState) {
      trackMovieFavorite(movie.id, movie.title);
    } else {
      trackMovieUnfavorite(movie.id, movie.title);
    }
  };

  const handleStreamingClick = (provider: string) => {
    trackStreamingClick(provider, movie.id, movie.title);
  };

  // Generate responsive image sizes
  const getResponsiveImageUrl = (path: string) => {
    if (!path) return null;
    return {
      small: `https://image.tmdb.org/t/p/w185${path}`,
      medium: `https://image.tmdb.org/t/p/w342${path}`,
      large: `https://image.tmdb.org/t/p/w500${path}`,
    };
  };

  const imageUrls = movie.poster_path ? getResponsiveImageUrl(movie.poster_path) : null;

  return (
    <Card className="movie-card bg-white dark:bg-secondary rounded-xl shadow-lg overflow-hidden dark-mode-optimized">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0" ref={ref}>
            {inView && imageUrls ? (
              <div className="relative w-full md:w-64 aspect-[2/3] rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
                <img
                  src={imageUrls.small}
                  srcSet={`${imageUrls.small} 185w, ${imageUrls.medium} 342w, ${imageUrls.large} 500w`}
                  sizes="(max-width: 768px) 100vw, 256px"
                  alt={movie.title}
                  className={`w-full h-full object-cover transition-opacity duration-300 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  loading="lazy"
                  onLoad={() => setImageLoaded(true)}
                />
                {!imageLoaded && (
                  <div className="absolute inset-0 animate-pulse bg-gray-300 dark:bg-gray-600" />
                )}
              </div>
            ) : (
              <div className="w-full md:w-64 aspect-[2/3] rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
            )}
          </div>
          <div className="flex-grow space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold">{movie.title}</h2>
                <div className="text-muted-foreground mt-1 space-x-2">
                  {releaseYear && (
                    <span>
                      {t('movie.year')}: {releaseYear}
                    </span>
                  )}
                  {runtime && (
                    <span>
                      • {runtime} {t('movie.runtime')}
                    </span>
                  )}
                </div>
                {genres && (
                  <div className="text-sm text-muted-foreground mt-1">
                    {genres}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleFavoriteToggle}
                >
                  {isFavorite(movie.storedId) ? (
                    <Heart className="h-5 w-5 fill-primary text-primary" />
                  ) : (
                    <HeartOff className="h-5 w-5" />
                  )}
                </Button>
                <a
                  href={getTmdbMovieUrl(movie.id, language)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="ghost" size="icon">
                    <ExternalLink className="h-5 w-5" />
                  </Button>
                </a>
              </div>
            </div>
            <p className="text-muted-foreground">{movie.overview}</p>
            <StreamingLinks movie={movie} onProviderClick={handleStreamingClick} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
