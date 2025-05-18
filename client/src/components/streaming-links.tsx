import React, { useEffect, useState } from 'react';
import { TmdbMovie } from '@shared/schema';
import { Film, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/lib/localization';

interface StreamingLinksProps {
  movie: TmdbMovie;
  onProviderClick?: (provider: string) => void;
}

interface Provider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
}

// Provider ID to search URL mapping
const providerSearchUrls: Record<number, string> = {
  8: 'https://www.netflix.com/search?q=', // Netflix
  9: 'https://www.primevideo.com/search/?phrase=', // Prime Video
  337: 'https://www.disneyplus.com/search?q=', // Disney+
  384: 'https://www.hbomax.com/search?q=', // HBO Max
  350: 'https://tv.apple.com/search?term=', // Apple TV
  2: 'https://www.apple.com/us/search/', // Apple iTunes
  3: 'https://play.google.com/store/search?q=', // Google Play
  283: 'https://www.crunchyroll.com/search?q=', // Crunchyroll
  257: 'https://www.fubo.tv/search/', // FuboTV
  387: 'https://www.peacocktv.com/search?q=', // Peacock
  157: 'https://hulu.com/search?q=', // Hulu
  11: 'https://mubi.com/search/', // MUBI
  188: 'https://www.youtube.com/results?search_query=', // YouTube
  190: 'https://www.youtube.com/results?search_query=', // YouTube Premium
  237: 'https://www.amazon.com/s?k=', // Amazon Video
  372: 'https://www.microsoft.com/en-us/search/shop/movies?q=', // Microsoft Store
  371: 'https://www.apple.com/us/search/', // Apple TV+
  442: 'https://www.paramountplus.com/search/?q=', // Paramount+
  // Add more providers as needed
};

export default function StreamingLinks({ movie, onProviderClick }: StreamingLinksProps) {
  const { t, language } = useTranslation();
  const [userCountry, setUserCountry] = useState<string>('US');

  useEffect(() => {
    // Map language to country code
    const languageToCountry: Record<string, string> = {
      en: 'US',
      es: 'ES',
      fr: 'FR',
      de: 'DE',
      ja: 'JP',
      zh: 'CN',
      tr: 'TR'
    };

    // Set country based on selected language
    setUserCountry(languageToCountry[language] || 'US');
  }, [language]);
  
  // Get providers for user's country
  const countryProviders = movie.watch_providers?.results?.[userCountry];
  
  if (!countryProviders) {
    // Only log if there are no providers for the current country
    if (movie.watch_providers?.results && Object.keys(movie.watch_providers.results).length > 0) {
      // Get available countries
      const availableCountries = Object.keys(movie.watch_providers.results).join(', ');
      console.log(`No providers found for ${userCountry}. Available in: ${availableCountries}`);
    }
    return null;
  }

  // Group providers by type
  const streamingProviders = countryProviders.flatrate || [];
  const rentProviders = countryProviders.rent || [];
  const buyProviders = countryProviders.buy || [];

  // If no providers at all, return null
  if (streamingProviders.length === 0 && rentProviders.length === 0 && buyProviders.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 space-y-4">
      {streamingProviders.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-2">{t('streaming.title')}</h3>
          <div className="flex flex-wrap gap-2">
            {streamingProviders.map((provider) => (
              <StreamingButton 
                key={provider.provider_id} 
                provider={provider}
                movieTitle={movie.title}
                onProviderClick={onProviderClick}
              />
            ))}
          </div>
        </div>
      )}

      {rentProviders.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-2">{t('streaming.rent')}</h3>
          <div className="flex flex-wrap gap-2">
            {rentProviders.map((provider) => (
              <StreamingButton 
                key={provider.provider_id} 
                provider={provider}
                movieTitle={movie.title}
                onProviderClick={onProviderClick}
              />
            ))}
          </div>
        </div>
      )}

      {buyProviders.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-2">{t('streaming.buy')}</h3>
          <div className="flex flex-wrap gap-2">
            {buyProviders.map((provider) => (
              <StreamingButton 
                key={provider.provider_id} 
                provider={provider}
                movieTitle={movie.title}
                onProviderClick={onProviderClick}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface StreamingButtonProps {
  provider: Provider;
  movieTitle: string;
  onProviderClick?: (provider: string) => void;
}

function StreamingButton({ provider, movieTitle, onProviderClick }: StreamingButtonProps) {
  // Get the search URL for this provider
  const searchUrl = providerSearchUrls[provider.provider_id];
  
  // If we don't have a search URL for this provider, use Google search
  const url = searchUrl 
    ? `${searchUrl}${encodeURIComponent(movieTitle)}`
    : `https://www.google.com/search?q=${encodeURIComponent(`${movieTitle} watch on ${provider.provider_name}`)}`;

  const handleClick = () => {
    onProviderClick?.(provider.provider_name);
  };

  return (
    <a 
      href={url}
      target="_blank" 
      rel="noopener noreferrer"
      className="inline-block"
      onClick={handleClick}
    >
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <img 
          src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
          alt={provider.provider_name}
          className="h-4 w-4 object-contain"
        />
        <span>{provider.provider_name}</span>
        <ExternalLink className="h-3 w-3 ml-1 opacity-70" />
      </Button>
    </a>
  );
}