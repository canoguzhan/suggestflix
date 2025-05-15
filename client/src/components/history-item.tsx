import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Movie } from "@shared/schema";
import { formatDate } from "@/lib/utils";

interface HistoryItemProps {
  movie: Movie;
  viewedAt?: Date;
  onSelect: () => void;
}

export default function HistoryItem({ movie, viewedAt, onSelect }: HistoryItemProps) {
  const posterUrl = movie.posterPath 
    ? `https://image.tmdb.org/t/p/w200${movie.posterPath}` 
    : "https://via.placeholder.com/200x300?text=No+Poster+Available";
  
  const releaseYear = movie.releaseDate ? movie.releaseDate.slice(0, 4) : "Unknown";
  
  return (
    <Card 
      className="movie-card w-48 flex-shrink-0 bg-white dark:bg-secondary rounded-lg shadow-md overflow-hidden"
      onClick={onSelect}
    >
      <div className="w-full h-56 overflow-hidden">
        <img 
          src={posterUrl}
          alt={`${movie.title} poster`} 
          className="w-full h-full object-cover"
        />
      </div>
      <CardContent className="p-3">
        <h4 className="font-semibold text-secondary dark:text-white truncate">
          {movie.title}
        </h4>
        <p className="text-xs text-accent">{releaseYear}</p>
        <Button 
          variant="secondary" 
          size="sm" 
          className="mt-2 w-full text-xs"
          onClick={onSelect}
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
}
