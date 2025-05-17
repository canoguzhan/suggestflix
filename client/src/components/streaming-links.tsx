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
}

export default function StreamingLinks({ movie }: StreamingLinksProps) {
  const { t } = useTranslation();
  const userCountry = navigator.language.split('-')[1]?.toLowerCase() || 'us';
  
  // Debug logging
  console.log('Full movie data:', movie);
  console.log('Watch providers data:', movie.watch_providers);
  console.log('User country:', userCountry);
  
  // Get providers for user's country
  const countryProviders = movie.watch_providers?.results?.[userCountry];
  
  // Debug logging
  console.log('Country providers:', countryProviders);
  
  if (!countryProviders) {
    console.log('No providers found for country:', userCountry);
    return null;
  }

  // Combine all provider types
  const allProviders = [
    ...(countryProviders.flatrate || []),
    ...(countryProviders.rent || []),
    ...(countryProviders.buy || [])
  ];

  // Debug logging
  console.log('All providers before deduplication:', allProviders);

  // Remove duplicates based on provider_id
  const uniqueProviders = allProviders.filter((provider, index, self) =>
    index === self.findIndex((p) => p.provider_id === provider.provider_id)
  );

  console.log('Unique providers after deduplication:', uniqueProviders);

  if (uniqueProviders.length === 0) {
    console.log('No unique providers found after deduplication');
    return null;
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">{t('streaming.title')}</h3>
      <div className="flex flex-wrap gap-2">
        {uniqueProviders.map((provider) => (
          <StreamingButton 
            key={provider.provider_id} 
            provider={provider}
            watchUrl={countryProviders.link}
          />
        ))}
      </div>
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