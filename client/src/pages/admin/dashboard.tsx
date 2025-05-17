import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { TmdbMovie } from '@shared/schema';
import { useDebounce } from '@/hooks/use-debounce';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScheduledPost {
  id: string;
  movieId: number;
  message: string;
  scheduledFor: Date;
  platforms: {
    twitter: boolean;
    facebook: boolean;
    instagram: boolean;
  };
  status: 'pending' | 'completed' | 'failed';
}

export default function AdminDashboard() {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());
  const [selectedMovie, setSelectedMovie] = React.useState<TmdbMovie | null>(null);
  const [message, setMessage] = React.useState('');
  const [platforms, setPlatforms] = React.useState({
    twitter: true,
    facebook: true,
    instagram: true
  });
  const [searchQuery, setSearchQuery] = React.useState('');
  const [open, setOpen] = React.useState(false);
  
  const debouncedSearch = useDebounce(searchQuery, 500);

  // Fetch movies based on search query
  const { data: searchResults = [], isLoading: isSearching } = useQuery<TmdbMovie[]>({
    queryKey: ['movie-search', debouncedSearch],
    queryFn: async () => {
      if (!debouncedSearch) return [];
      const res = await fetch(`/api/movies/search?query=${encodeURIComponent(debouncedSearch)}`);
      if (!res.ok) throw new Error('Failed to search movies');
      return res.json();
    },
    enabled: Boolean(debouncedSearch),
  });

  // Fetch scheduled posts
  const { data: scheduledPosts = [], isLoading } = useQuery<ScheduledPost[]>({
    queryKey: ['scheduled-posts'],
    queryFn: async () => {
      const res = await fetch('/api/admin/scheduled-posts');
      if (!res.ok) throw new Error('Failed to fetch scheduled posts');
      return res.json();
    }
  });

  // Handle post scheduling
  const handleSchedulePost = async () => {
    if (!selectedMovie || !selectedDate) return;

    try {
      const response = await fetch('/api/admin/schedule-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          movieId: selectedMovie.id,
          message,
          scheduledFor: selectedDate,
          platforms
        })
      });

      if (!response.ok) throw new Error('Failed to schedule post');
      
      // Reset form
      setMessage('');
      setSelectedMovie(null);
      setSearchQuery('');
    } catch (error) {
      console.error('Failed to schedule post:', error);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Social Media Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Schedule New Post */}
        <Card>
          <CardHeader>
            <CardTitle>Schedule New Post</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Select Movie</Label>
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={open}
                      className="w-full justify-between"
                    >
                      {selectedMovie ? selectedMovie.title : "Search for a movie..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput
                        placeholder="Search movies..."
                        value={searchQuery}
                        onValueChange={setSearchQuery}
                      />
                      <CommandEmpty>
                        {isSearching ? "Searching..." : "No movies found."}
                      </CommandEmpty>
                      <CommandGroup>
                        {searchResults.map((movie) => (
                          <CommandItem
                            key={movie.id}
                            value={movie.title}
                            onSelect={() => {
                              setSelectedMovie(movie);
                              setOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedMovie?.id === movie.id ? "opacity-100" : "opacity-0"
                              )}
                            />
                            {movie.title}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              
              <div>
                <Label>Message</Label>
                <Textarea 
                  placeholder="Write your post message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
              
              <div>
                <Label>Schedule Date</Label>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Platforms</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={platforms.twitter}
                      onCheckedChange={(checked) => 
                        setPlatforms(prev => ({ ...prev, twitter: checked }))
                      }
                    />
                    <Label>Twitter</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={platforms.facebook}
                      onCheckedChange={(checked) => 
                        setPlatforms(prev => ({ ...prev, facebook: checked }))
                      }
                    />
                    <Label>Facebook</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={platforms.instagram}
                      onCheckedChange={(checked) => 
                        setPlatforms(prev => ({ ...prev, instagram: checked }))
                      }
                    />
                    <Label>Instagram</Label>
                  </div>
                </div>
              </div>
              
              <Button 
                className="w-full"
                onClick={handleSchedulePost}
                disabled={!selectedMovie || !selectedDate || !message}
              >
                Schedule Post
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Scheduled Posts */}
        <Card>
          <CardHeader>
            <CardTitle>Scheduled Posts</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center">Loading...</div>
            ) : scheduledPosts.length === 0 ? (
              <div className="text-center text-gray-500">No scheduled posts</div>
            ) : (
              <div className="space-y-4">
                {scheduledPosts.map((post) => (
                  <div 
                    key={post.id} 
                    className="p-4 border rounded-lg"
                  >
                    <div className="font-semibold">Movie ID: {post.movieId}</div>
                    <div className="text-sm text-gray-600">{post.message}</div>
                    <div className="text-sm text-gray-500 mt-2">
                      Scheduled for: {new Date(post.scheduledFor).toLocaleString()}
                    </div>
                    <div className="flex gap-2 mt-2">
                      {Object.entries(post.platforms).map(([platform, enabled]) => 
                        enabled && (
                          <span 
                            key={platform}
                            className="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
                          >
                            {platform}
                          </span>
                        )
                      )}
                    </div>
                    <div className="mt-2">
                      <span className={cn(
                        "text-xs px-2 py-1 rounded",
                        post.status === 'completed' && "bg-green-100 text-green-800",
                        post.status === 'failed' && "bg-red-100 text-red-800",
                        post.status === 'pending' && "bg-yellow-100 text-yellow-800"
                      )}>
                        {post.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 