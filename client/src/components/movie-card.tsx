import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Heart, HeartOff, Share2 } from "lucide-react";
import { TmdbMovie } from "@shared/schema";
import { useTranslation } from "@/lib/localization";
import StreamingLinks from "@/components/streaming-links";
import { useFavorites } from "@/hooks/use-favorites";
import { getTmdbMovieUrl } from "@/lib/tmdb";
import { trackMovieFavorite, trackMovieUnfavorite, trackStreamingClick, trackMovieShare } from "@/lib/analytics";
import SocialShare from "@/components/social-share";

interface MovieCardProps {
  movie: TmdbMovie & { storedId: number };
}

export default function MovieCard({ movie }: MovieCardProps) {
  const { t, language } = useTranslation();
  const { toggleFavorite, isFavorite } = useFavorites();
  
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

  const handleShare = (platform: string) => {
    trackMovieShare(movie.id, movie.title, platform);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto movie-card">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0">
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="w-full md:w-64 rounded-lg shadow-lg"
            />
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
                <SocialShare
                  movieTitle={movie.title}
                  movieId={movie.id}
                  movieUrl={`${window.location.origin}/movie/${movie.id}`}
                  moviePoster={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  onShare={handleShare}
                  className="mr-2"
                />
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
