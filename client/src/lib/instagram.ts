export interface InstagramPost {
  id: string;
  media_url: string;
  caption: string;
  permalink: string;
  timestamp: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
}

interface InstagramResponse {
  data: InstagramPost[];
  paging: {
    cursors: {
      before: string;
      after: string;
    };
    next?: string;
  };
}

const INSTAGRAM_API_URL = 'https://graph.facebook.com/v18.0/me/media';
const INSTAGRAM_ACCESS_TOKEN = (import.meta as unknown as { env: { VITE_INSTAGRAM_ACCESS_TOKEN?: string } }).env.VITE_INSTAGRAM_ACCESS_TOKEN;

export async function fetchInstagramPosts(limit: number = 6): Promise<InstagramPost[]> {
  if (!INSTAGRAM_ACCESS_TOKEN) {
    console.warn('Instagram access token not found. Using dummy data instead.');
    return getDummyPosts();
  }

  console.log('Attempting to fetch Instagram posts with token:', INSTAGRAM_ACCESS_TOKEN.substring(0, 10) + '...');
  try {
    const url = `${INSTAGRAM_API_URL}?fields=id,media_url,caption,permalink,timestamp,media_type,thumbnail_url&limit=${limit}&access_token=${INSTAGRAM_ACCESS_TOKEN}`;
    console.log('Fetching from URL:', url.replace(INSTAGRAM_ACCESS_TOKEN, '***'));
    const response = await fetch(url);

    console.log('Response status:', response.status);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Instagram API Error:', errorData);
      console.error('Full error response:', JSON.stringify(errorData, null, 2));
      throw new Error(`Failed to fetch Instagram posts: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data: InstagramResponse = await response.json();
    console.log('Instagram API Response:', JSON.stringify(data, null, 2));
    if (!data.data || data.data.length === 0) {
      console.warn('No Instagram posts found. Using dummy data instead.');
      return getDummyPosts();
    }

    return data.data;
  } catch (error) {
    console.error('Error fetching Instagram posts:', error instanceof Error ? error.message : error);
    if (error instanceof Error && error.stack) {
      console.error('Error stack:', error.stack);
    }
    return getDummyPosts();
  }
}

// Fallback dummy data when Instagram API is not available
function getDummyPosts(): InstagramPost[] {
  return [
    {
      id: '1',
      media_url: 'https://picsum.photos/400/400?random=1',
      caption: 'Movie night vibes 🎬 #SuggestFlix',
      permalink: 'https://instagram.com/suggestflix',
      timestamp: '2023-10-01T12:00:00Z',
      media_type: 'IMAGE'
    },
    {
      id: '2',
      media_url: 'https://picsum.photos/400/400?random=2',
      caption: 'New movie review – "Inception" – Mind blown! 🧠 #SuggestFlix',
      permalink: 'https://instagram.com/suggestflix',
      timestamp: '2023-09-28T12:00:00Z',
      media_type: 'IMAGE'
    },
    {
      id: '3',
      media_url: 'https://picsum.photos/400/400?random=3',
      caption: 'Behind the scenes: How we curate your next favorite film. #SuggestFlix',
      permalink: 'https://instagram.com/suggestflix',
      timestamp: '2023-09-25T12:00:00Z',
      media_type: 'IMAGE'
    },
    {
      id: '4',
      media_url: 'https://picsum.photos/400/400?random=4',
      caption: 'Happy Friday! What\'s on your watchlist? #SuggestFlix',
      permalink: 'https://instagram.com/suggestflix',
      timestamp: '2023-09-22T12:00:00Z',
      media_type: 'IMAGE'
    },
    {
      id: '5',
      media_url: 'https://picsum.photos/400/400?random=5',
      caption: 'Did you know? Our movie data is powered by TMDB. #SuggestFlix',
      permalink: 'https://instagram.com/suggestflix',
      timestamp: '2023-09-20T12:00:00Z',
      media_type: 'IMAGE'
    },
    {
      id: '6',
      media_url: 'https://picsum.photos/400/400?random=6',
      caption: 'Join our community and discover your next favorite film! #SuggestFlix',
      permalink: 'https://instagram.com/suggestflix',
      timestamp: '2023-09-18T12:00:00Z',
      media_type: 'IMAGE'
    }
  ];
} 