export interface RedditPost {
  id: string;
  title: string;
  link: string;
  author: string;
  published: string;
  content: string;
  thumbnail?: string;
}

export async function fetchRedditPosts(): Promise<RedditPost[]> {
  try {
    const response = await fetch('/api/reddit/rss');
    if (!response.ok) {
      throw new Error(`Failed to fetch Reddit RSS feed: ${response.status}`);
    }

    const { feed } = await response.json();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(feed, 'text/xml');

    // Get all item elements (posts)
    const items = xmlDoc.getElementsByTagName('item');
    const posts: RedditPost[] = [];

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const title = item.getElementsByTagName('title')[0]?.textContent || '';
      const link = item.getElementsByTagName('link')[0]?.textContent || '';
      const author = item.getElementsByTagName('dc:creator')[0]?.textContent || '';
      const published = item.getElementsByTagName('pubDate')[0]?.textContent || '';
      const content = item.getElementsByTagName('description')[0]?.textContent || '';
      
      // Extract thumbnail from content if available
      const thumbnailMatch = content.match(/<img[^>]+src="([^">]+)"/);
      const thumbnail = thumbnailMatch ? thumbnailMatch[1] : undefined;

      // Generate a unique ID from the link
      const id = link.split('/').pop() || `post-${i}`;

      posts.push({
        id,
        title,
        link,
        author,
        published,
        content: content.replace(/<[^>]*>/g, ''), // Remove HTML tags
        thumbnail
      });
    }

    return posts;
  } catch (error) {
    console.error('Error fetching Reddit posts:', error);
    return getDummyPosts();
  }
}

// Fallback dummy data when Reddit RSS feed is not available
function getDummyPosts(): RedditPost[] {
  return [
    {
      id: '1',
      title: 'Discussion: What\'s your favorite movie of 2024 so far?',
      link: 'https://www.reddit.com/r/movies/comments/example1',
      author: 'MovieFan123',
      published: new Date().toISOString(),
      content: 'Let\'s discuss our favorite movies of 2024! What has impressed you the most this year?',
      thumbnail: 'https://picsum.photos/400/300?random=1'
    },
    {
      id: '2',
      title: 'Official Discussion: Dune: Part Two [SPOILERS]',
      link: 'https://www.reddit.com/r/movies/comments/example2',
      author: 'SciFiLover',
      published: new Date(Date.now() - 86400000).toISOString(),
      content: 'Share your thoughts on Denis Villeneuve\'s epic conclusion to the Dune saga.',
      thumbnail: 'https://picsum.photos/400/300?random=2'
    },
    {
      id: '3',
      title: 'Movie News: Upcoming Releases for Summer 2024',
      link: 'https://www.reddit.com/r/movies/comments/example3',
      author: 'MovieNewsBot',
      published: new Date(Date.now() - 172800000).toISOString(),
      content: 'A comprehensive list of major movie releases coming this summer.',
      thumbnail: 'https://picsum.photos/400/300?random=3'
    }
  ];
} 