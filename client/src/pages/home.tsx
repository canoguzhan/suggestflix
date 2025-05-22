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
import { Helmet } from "react-helmet-async";
import "@/styles/media-queries.css";

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
    <>
      <Helmet>
        <title>SuggestFlix - Discover Your Next Favorite Movie</title>
        <meta name="description" content="Find your perfect movie match with SuggestFlix. Get personalized movie recommendations and discover new films based on your taste." />
        <link rel="canonical" href="https://suggestflix.com/" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      </Helmet>
      <main className="container mx-auto px-4 py-8 touch-optimized">
        {/* Hero Section */}
        <section className="text-center mb-12 mt-8 hero-section landscape-optimized">
          <h1 className="text-4xl md:text-5xl font-bold text-secondary dark:text-white mb-4 dark-mode-optimized">
            {t('discover.title')}
          </h1>
          <p className="text-accent max-w-2xl mx-auto text-lg md:text-xl">
            {t('discover.description')}
          </p>
        </section>
        
        {/* Movie Discovery Section */}
        <section className="text-center mb-16 content-section">
          <h2 className="text-2xl md:text-3xl font-semibold text-secondary dark:text-white mb-6 dark-mode-optimized">
            Ready to Find Your Next Watch?
          </h2>
          <Button 
            onClick={handleSuggestMovie}
            size="lg" 
            className="netflix-button bg-primary hover:bg-primary/90 text-white font-bold py-4 px-6 md:px-10 rounded-lg text-lg md:text-2xl shadow-lg touch-optimized"
          >
            <Shuffle className="mr-2 h-5 w-5" /> {t('suggest.button')}
          </Button>
        </section>

        {/* Top Ad Banner */}
        <div className="w-full max-w-4xl mx-auto mb-8 ad-banner no-print">
          <AdSense 
            adSlot="1234567890" 
            adFormat="horizontal" 
            style={{ height: "90px" }} 
            className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-sm dark-mode-optimized" 
          />
        </div>

        {/* Loading State */}
        {isLoadingMovie && (
          <section className="flex justify-center items-center my-16 content-section">
            <div className="animate-spin rounded-full h-12 w-12 md:h-16 md:w-16 border-t-4 border-primary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </section>
        )}

        {/* Error State */}
        {isErrorMovie && (
          <section className="max-w-4xl mx-auto bg-white dark:bg-secondary rounded-xl shadow-lg overflow-hidden mb-12 p-4 md:p-6 text-center content-section dark-mode-optimized">
            <h2 className="text-xl md:text-2xl font-bold text-secondary dark:text-white mb-2">
              {t('error.title')}
            </h2>
            <p className="text-accent mb-4 text-sm md:text-base">
              {t('error.message')}
            </p>
            <Button 
              onClick={handleSuggestMovie}
              variant="default"
              className="touch-optimized"
            >
              {t('error.button')}
            </Button>
          </section>
        )}

        {/* Movie Card Section */}
        {showMovie && movie && !isLoadingMovie && !isErrorMovie && (
          <section className="content-section">
            <div className="movie-card">
              <MovieCard 
                movie={{
                  ...movie as TmdbMovie,
                  storedId: (movie as any).storedId || 0
                }}
              />
            </div>
            
            {/* Bottom Ad Banner - displayed only when a movie is shown */}
            <div className="w-full max-w-4xl mx-auto mt-8 md:mt-10 mb-4 ad-banner no-print">
              <AdSense 
                adSlot="0987654321" 
                adFormat="rectangle" 
                style={{ height: "250px", width: "300px" }} 
                className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-sm mx-auto dark-mode-optimized" 
              />
            </div>
          </section>
        )}
        
        {/* Bottom Ad Banner - always visible */}
        <div className="w-full max-w-4xl mx-auto mt-8 md:mt-12 ad-banner no-print">
          <AdSense 
            adSlot="1122334455" 
            adFormat="horizontal" 
            style={{ height: "90px" }} 
            className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-sm dark-mode-optimized" 
          />
        </div>
      </main>
    </>
  );
}
