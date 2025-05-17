import React from 'react';
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
  provider_url?: string;
}

export default function StreamingLinks({ movie }: StreamingLinksProps) {
  const { t } = useTranslation();
  const userCountry = navigator.language.split('-')[1]?.toLowerCase() || 'us';
  
  // Debug logging
  console.log('Full movie data:', movie);
  console.log('Watch providers data:', movie.watch_providers);
  console.log('User country:', userCountry);
  
  // Get providers for user's country
  const countryProviders = movie.watch_providers?.results?.[userCountry.toUpperCase()];
  
  // Debug logging
  console.log('Country providers:', countryProviders);
  
  if (!countryProviders) {
    console.log('No providers found for country:', userCountry);
    return null;
  }

  // Group providers by type and add URLs
  const streamingProviders = (countryProviders.flatrate || []).map(provider => ({
    ...provider,
    provider_url: countryProviders.link
  }));
  const rentProviders = (countryProviders.rent || []).map(provider => ({
    ...provider,
    provider_url: countryProviders.link
  }));
  const buyProviders = (countryProviders.buy || []).map(provider => ({
    ...provider,
    provider_url: countryProviders.link
  }));

  // If no providers at all, return null
  if (streamingProviders.length === 0 && rentProviders.length === 0 && buyProviders.length === 0) {
    console.log('No providers available');
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
}

function StreamingButton({ provider }: StreamingButtonProps) {
  return (
    <a 
      href={provider.provider_url} 
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