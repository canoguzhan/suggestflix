import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { TmdbMovie } from "@shared/schema";
import { useTranslation } from "@/lib/localization";
import StreamingLinks from "@/components/streaming-links";

interface MovieCardProps {
  movie: TmdbMovie & { storedId: number };
}

export default function MovieCard({ movie }: MovieCardProps) {
  const { t } = useTranslation();
  
  const posterUrl = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
    : "https://via.placeholder.com/500x750?text=No+Poster+Available";

  // Format release date
  const releaseYear = movie.release_date ? movie.release_date.slice(0, 4) : "Unknown";
  
  return (
    <Card id="movieCard" className="max-w-4xl mx-auto bg-white dark:bg-secondary rounded-xl shadow-lg overflow-hidden mb-12">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3 flex-shrink-0">
          <img 
            src={posterUrl}
            alt={`${movie.title} poster`} 
            className="w-full h-auto md:h-full object-cover"
          />
        </div>
        <CardContent className="p-6 md:w-2/3">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-2xl font-bold text-secondary dark:text-white">{movie.title}</h3>
            <div className="flex items-center">
              <span className="bg-primary text-white py-1 px-2 rounded-lg text-sm font-bold">
                {movie.vote_average?.toFixed(1)}
              </span>
            </div>
          </div>

          <div className="mb-4">
            <span className="text-accent mr-3">{releaseYear}</span>
            {movie.runtime && <span className="text-accent">{movie.runtime} {t('movie.runtime')}</span>}
          </div>

          {movie.genres && movie.genres.length > 0 && (
            <div className="mb-4 text-sm">
              {movie.genres.map((genre) => (
                <span 
                  key={genre.id}
                  className="inline-block bg-gray-200 dark:bg-gray-800 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 dark:text-gray-300 mr-2 mb-2"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          )}

          <p className="text-accent mb-6">{movie.overview}</p>

          <div className="flex flex-wrap gap-2">
            <Button 
              variant="secondary"
              className="inline-flex items-center"
              asChild
            >
              <a href={`https://www.themoviedb.org/movie/${movie.id}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink size={16} className="mr-2" /> {t('movie.viewTmdb')}
              </a>
            </Button>
          </div>

          <StreamingLinks movie={movie} />
        </CardContent>
      </div>
    </Card>
  );
}
