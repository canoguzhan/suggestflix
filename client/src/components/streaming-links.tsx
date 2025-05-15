import React from 'react';
import { TmdbMovie } from '@shared/schema';
import { StreamingService, getStreamingLinks, getStreamingSearchUrl } from '@/lib/streaming';
import { Film, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/lib/localization';

interface StreamingLinksProps {
  movie: TmdbMovie;
}

export default function StreamingLinks({ movie }: StreamingLinksProps) {
  const { t } = useTranslation();
  const streamingServices = getStreamingLinks(movie);

  if (streamingServices.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-2">{t('streaming.title')}</h3>
      <div className="flex flex-wrap gap-2">
        {streamingServices.map((service) => (
          <StreamingButton 
            key={service.name} 
            service={service} 
            movie={movie}
          />
        ))}
      </div>
    </div>
  );
}

interface StreamingButtonProps {
  service: StreamingService;
  movie: TmdbMovie;
}

function StreamingButton({ service, movie }: StreamingButtonProps) {
  const searchUrl = getStreamingSearchUrl(service, movie);
  
  return (
    <a 
      href={searchUrl} 
      target="_blank" 
      rel="noopener noreferrer"
      className="inline-block"
    >
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        style={{
          borderColor: service.color,
          color: service.color
        }}
      >
        <Film className="h-4 w-4" />
        <span>{service.name}</span>
        <ExternalLink className="h-3 w-3 ml-1 opacity-70" />
      </Button>
    </a>
  );
}