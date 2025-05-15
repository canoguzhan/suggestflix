import { useQuery } from "@tanstack/react-query";
import { historyQuery } from "@/lib/tmdb";

export function useMovieHistory() {
  const { 
    data: history,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery(historyQuery());
  
  return {
    history,
    isLoading,
    isError,
    error,
    refetch
  };
}
