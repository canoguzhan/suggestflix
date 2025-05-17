import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Favorite, Movie } from "@shared/schema";

interface FavoriteWithMovie extends Favorite {
  movie: Movie;
}

export function useFavorites() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch favorites
  const { 
    data: favorites = [] as FavoriteWithMovie[],
    isLoading,
    isError,
    error 
  } = useQuery({
    queryKey: ["/api/movies/favorites"],
    queryFn: async () => {
      const res = await fetch("/api/movies/favorites");
      if (!res.ok) {
        throw new Error("Failed to fetch favorites");
      }
      return res.json() as Promise<FavoriteWithMovie[]>;
    }
  });

  // Toggle favorite mutation
  const { mutate: toggleFavorite } = useMutation({
    mutationFn: async (movieId: number) => {
      const res = await fetch("/api/movies/favorites/toggle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ movieId }),
      });
      if (!res.ok) {
        throw new Error("Failed to toggle favorite");
      }
      return res.json() as Promise<{ favorite: boolean; message: string }>;
    },
    onSuccess: (data) => {
      // Invalidate favorites query to trigger refetch
      queryClient.invalidateQueries({ queryKey: ["/api/movies/favorites"] });
      
      // Show success toast
      toast({
        title: data.favorite ? "Added to Favorites" : "Removed from Favorites",
        description: data.message,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update favorites",
        variant: "destructive",
      });
    },
  });

  // Check if a movie is in favorites
  const isFavorite = (movieId: number): boolean => {
    return favorites.some(favorite => favorite.movieId === movieId);
  };

  return {
    favorites,
    isLoading,
    isError,
    error,
    toggleFavorite,
    isFavorite,
  };
}
