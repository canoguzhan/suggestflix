import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { TmdbMovie } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Shuffle } from "lucide-react";
import MovieCard from "@/components/movie-card";
import { useToast } from "@/hooks/use-toast";
import { randomMovieQuery } from "@/lib/tmdb";
import { useTranslation } from "@/lib/localization";
import AdSense from "@/components/adsense";

export default function Home() {
  const [showMovie, setShowMovie] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

  // Random movie query
  const { 
    data: movie,
    refetch: refetchMovie,
    isLoading: isLoadingMovie,
    isError: isErrorMovie,
    error: movieError
  } = useQuery({
    ...randomMovieQuery(),
    enabled: false, // Don't fetch automatically
  });

  // Handle suggest movie button click
  const handleSuggestMovie = async () => {
    setShowMovie(true);
    try {
      await refetchMovie();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to fetch movie: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      });
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Intro Section */}
      <section className="text-center mb-12 mt-8">
        <h2 className="text-2xl md:text-3xl font-bold text-secondary dark:text-white mb-4">
          {t('discover.title')}
        </h2>
        <p className="text-accent max-w-2xl mx-auto">
          {t('discover.description')}
        </p>
      </section>
      
      {/* Top Ad Banner */}
      <div className="w-full max-w-4xl mx-auto mb-8">
        <AdSense 
          adSlot="1234567890" 
          adFormat="horizontal" 
          style={{ height: "90px" }} 
          className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-sm" 
        />
      </div>

      {/* CTA Button */}
      <section className="text-center mb-16">
        <Button 
          onClick={handleSuggestMovie}
          size="lg" 
          className="netflix-button bg-primary hover:bg-primary/90 text-white font-bold py-4 px-10 rounded-lg text-xl md:text-2xl shadow-lg"
        >
          <Shuffle className="mr-2 h-5 w-5" /> {t('suggest.button')}
        </Button>
      </section>

      {/* Loading State */}
      {isLoadingMovie && (
        <div className="flex justify-center items-center my-16">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {isErrorMovie && (
        <div className="max-w-4xl mx-auto bg-white dark:bg-secondary rounded-xl shadow-lg overflow-hidden mb-12 p-6 text-center">
          <div className="text-primary text-5xl mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-secondary dark:text-white mb-2">
            {t('error.title')}
          </h3>
          <p className="text-accent mb-4">
            {t('error.message')}
          </p>
          <Button 
            onClick={handleSuggestMovie}
            variant="default"
          >
            {t('error.button')}
          </Button>
        </div>
      )}

      {/* Movie Card */}
      {showMovie && movie && !isLoadingMovie && !isErrorMovie && (
        <>
          <MovieCard 
            movie={{
              ...movie as TmdbMovie,
              storedId: (movie as any).storedId || 0
            }}
          />
          
          {/* Bottom Ad Banner - displayed only when a movie is shown */}
          <div className="w-full max-w-4xl mx-auto mt-10 mb-4">
            <AdSense 
              adSlot="0987654321" 
              adFormat="rectangle" 
              style={{ height: "250px", width: "300px" }} 
              className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-sm mx-auto" 
            />
          </div>
        </>
      )}
      
      {/* Bottom Ad Banner - always visible */}
      <div className="w-full max-w-4xl mx-auto mt-12">
        <AdSense 
          adSlot="1122334455" 
          adFormat="horizontal" 
          style={{ height: "90px" }} 
          className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-sm" 
        />
      </div>
    </main>
  );
}
