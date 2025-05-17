import React, { useEffect, useState } from 'react';
import { TmdbMovie } from '@shared/schema';
import { Film, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/lib/localization';

interface StreamingLinksProps {
  movie: TmdbMovie;
}

interface Provider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
}

export default function StreamingLinks({ movie }: StreamingLinksProps) {
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

  // Get the appropriate TMDB domain based on language
  const getTmdbDomain = () => {
    const langToDomain: Record<string, string> = {
      tr: 'www.themoviedb.org/tr',
      en: 'www.themoviedb.org',
      es: 'www.themoviedb.org/es',
      fr: 'www.themoviedb.org/fr',
      de: 'www.themoviedb.org/de',
      ja: 'www.themoviedb.org/ja',
      zh: 'www.themoviedb.org/zh'
    };
    return langToDomain[language] || 'www.themoviedb.org';
  };

  // Convert TMDB URL to localized version
  const getLocalizedTmdbUrl = (url: string) => {
    const tmdbDomain = getTmdbDomain();
    return url.replace('www.themoviedb.org', tmdbDomain);
  };

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
                watchUrl={getLocalizedTmdbUrl(countryProviders.link)}
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
                watchUrl={getLocalizedTmdbUrl(countryProviders.link)}
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
                watchUrl={getLocalizedTmdbUrl(countryProviders.link)}
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
  watchUrl: string;
}

function StreamingButton({ provider, watchUrl }: StreamingButtonProps) {
  return (
    <a 
      href={watchUrl} 
      target="_blank" 
      rel="noopener noreferrer"
      className="inline-block"
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