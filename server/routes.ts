import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMovieSchema, tmdbMovieSchema } from "@shared/schema";
import { z } from "zod";

const TMDB_API_KEY = process.env.TMDB_API_KEY || process.env.VITE_TMDB_API_KEY || "";

export async function registerRoutes(app: Express): Promise<Server> {
  // Validate TMDB API key
  if (!TMDB_API_KEY) {
    console.error("TMDB_API_KEY is not set. The app will not function correctly.");
  }

  // Get random movie from TMDB
  app.get('/api/movies/random', async (req: Request, res: Response) => {
    try {
      // Get a random page number between 1 and 500 (TMDB has a limit of 500 pages)
      const page = Math.floor(Math.random() * 500) + 1;
      
      // Get language from request (default to 'en')
      const language = req.query.language || 'en';
      
      // Fetch a page of popular movies in the requested language
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=${language}&page=${page}`
      );
      
      if (!response.ok) {
        throw new Error(`TMDB API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (!data.results || !data.results.length) {
        return res.status(404).json({ message: "No movies found" });
      }
      
      // Get a random movie from the results
      const randomIndex = Math.floor(Math.random() * data.results.length);
      const randomMovie = data.results[randomIndex];
      
      // Fetch additional details for the movie in the requested language
      const detailsResponse = await fetch(
        `https://api.themoviedb.org/3/movie/${randomMovie.id}?api_key=${TMDB_API_KEY}&language=${language}`
      );
      
      if (!detailsResponse.ok) {
        throw new Error(`TMDB API error fetching details: ${detailsResponse.status}`);
      }

      // Fetch watch providers separately
      const watchProvidersResponse = await fetch(
        `https://api.themoviedb.org/3/movie/${randomMovie.id}/watch/providers?api_key=${TMDB_API_KEY}`
      );
      
      if (!watchProvidersResponse.ok) {
        throw new Error(`TMDB API error fetching watch providers: ${watchProvidersResponse.status}`);
      }
      
      const movieDetails = await detailsResponse.json();
      const watchProvidersData = await watchProvidersResponse.json();
      
      // Combine movie details with watch providers data
      const movieWithProviders = {
        ...movieDetails,
        watch_providers: {
          results: watchProvidersData.results || {}
        }
      };
      
      // Parse and validate the movie data
      const validatedMovie = tmdbMovieSchema.parse(movieWithProviders);
      
      // Store the movie in our database if it doesn't exist
      let storedMovie = await storage.getMovieByTmdbId(validatedMovie.id);
      
      if (!storedMovie) {
        const movieToInsert = insertMovieSchema.parse({
          tmdbId: validatedMovie.id,
          title: validatedMovie.title,
          posterPath: validatedMovie.poster_path,
          releaseDate: validatedMovie.release_date,
          overview: validatedMovie.overview,
          voteAverage: validatedMovie.vote_average.toString()
        });
        
        storedMovie = await storage.createMovie(movieToInsert);
        await storage.addMovieToHistory({ movieId: storedMovie.id });
      } else {
        await storage.addMovieToHistory({ movieId: storedMovie.id });
      }
      
      // Return the TMDB movie with additional fields
      return res.status(200).json({
        ...validatedMovie,
        favorite: await storage.isFavorite(storedMovie.id),
        storedId: storedMovie.id
      });
    } catch (error) {
      console.error("Error fetching random movie:", error);
      return res.status(500).json({ 
        message: "Failed to fetch random movie", 
        error: error instanceof Error ? error.message : String(error) 
      });
    }
  });

  // Get movie history
  app.get('/api/movies/history', async (req: Request, res: Response) => {
    try {
      // Get movie history without user association for now
      const history = await storage.getMovieHistory();
      
      // Create an array for the detailed history items
      const detailedHistory = [];
      
      // Fetch movie details for each history item
      for (const historyItem of history) {
        const movie = await storage.getMovie(historyItem.movieId);
        if (movie) {
          detailedHistory.push({
            ...historyItem,
            movie
          });
        }
      }
      
      // Sort by viewedAt descending
      detailedHistory.sort((a, b) => 
        new Date(b.viewedAt).getTime() - new Date(a.viewedAt).getTime()
      );
      
      return res.status(200).json(detailedHistory);
    } catch (error) {
      console.error("Error fetching movie history:", error);
      return res.status(500).json({ 
        message: "Failed to fetch movie history", 
        error: error instanceof Error ? error.message : String(error) 
      });
    }
  });

  // Toggle favorite status
  app.post('/api/movies/favorites/toggle', async (req: Request, res: Response) => {
    try {
      const { movieId } = req.body;
      
      if (!movieId) {
        return res.status(400).json({ message: "Movie ID is required" });
      }
      
      // Check if the movie is already favorited
      const isFavorite = await storage.isFavorite(movieId);
      
      if (isFavorite) {
        // Find the favorite to remove
        const favorites = await storage.getFavorites();
        const favorite = favorites.find(f => f.movieId === movieId);
        
        if (favorite) {
          await storage.removeFavorite(favorite.id);
        }
        
        return res.status(200).json({ 
          favorite: false,
          message: "Movie removed from favorites" 
        });
      } else {
        // Add to favorites
        await storage.addFavorite({ movieId });
        
        return res.status(200).json({ 
          favorite: true,
          message: "Movie added to favorites" 
        });
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      return res.status(500).json({ 
        message: "Failed to toggle favorite", 
        error: error instanceof Error ? error.message : String(error) 
      });
    }
  });

  // Get favorites
  app.get('/api/movies/favorites', async (req: Request, res: Response) => {
    try {
      const favorites = await storage.getFavorites();
      
      // Create an array for the detailed favorites
      const detailedFavorites = [];
      
      // Fetch movie details for each favorite
      for (const favorite of favorites) {
        const movie = await storage.getMovie(favorite.movieId);
        if (movie) {
          detailedFavorites.push({
            ...favorite,
            movie
          });
        }
      }
      
      // Sort by addedAt descending
      detailedFavorites.sort((a, b) => 
        new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
      );
      
      return res.status(200).json(detailedFavorites);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      return res.status(500).json({ 
        message: "Failed to fetch favorites", 
        error: error instanceof Error ? error.message : String(error) 
      });
    }
  });
  
  const httpServer = createServer(app);
  return httpServer;
}
