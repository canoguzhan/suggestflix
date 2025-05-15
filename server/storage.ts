import { 
  users, type User, type InsertUser,
  movies, type Movie, type InsertMovie,
  movieHistory, type MovieHistory, type InsertMovieHistory,
  favorites, type Favorite, type InsertFavorite,
  type TmdbMovie
} from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Movie operations
  getMovie(id: number): Promise<Movie | undefined>;
  getMovieByTmdbId(tmdbId: number): Promise<Movie | undefined>;
  createMovie(movie: InsertMovie): Promise<Movie>;
  
  // Movie history operations
  getMovieHistory(userId?: number): Promise<MovieHistory[]>;
  addMovieToHistory(movieHistory: InsertMovieHistory): Promise<MovieHistory>;
  
  // Favorites operations
  getFavorites(userId?: number): Promise<Favorite[]>;
  addFavorite(favorite: InsertFavorite): Promise<Favorite>;
  removeFavorite(id: number): Promise<void>;
  isFavorite(movieId: number, userId?: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private movies: Map<number, Movie>;
  private history: Map<number, MovieHistory>;
  private favs: Map<number, Favorite>;
  private userIdCounter: number;
  private movieIdCounter: number;
  private historyIdCounter: number;
  private favIdCounter: number;

  constructor() {
    this.users = new Map();
    this.movies = new Map();
    this.history = new Map();
    this.favs = new Map();
    this.userIdCounter = 1;
    this.movieIdCounter = 1;
    this.historyIdCounter = 1;
    this.favIdCounter = 1;
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Movie operations
  async getMovie(id: number): Promise<Movie | undefined> {
    return this.movies.get(id);
  }

  async getMovieByTmdbId(tmdbId: number): Promise<Movie | undefined> {
    return Array.from(this.movies.values()).find(
      (movie) => movie.tmdbId === tmdbId,
    );
  }

  async createMovie(insertMovie: InsertMovie): Promise<Movie> {
    const id = this.movieIdCounter++;
    const movie: Movie = { 
      ...insertMovie, 
      id, 
      addedAt: new Date() 
    };
    this.movies.set(id, movie);
    return movie;
  }

  // Movie history operations
  async getMovieHistory(userId?: number): Promise<MovieHistory[]> {
    const historyArray = Array.from(this.history.values());
    if (userId) {
      return historyArray.filter(h => h.userId === userId);
    }
    return historyArray;
  }

  async addMovieToHistory(insertHistory: InsertMovieHistory): Promise<MovieHistory> {
    const id = this.historyIdCounter++;
    const historyItem: MovieHistory = { 
      ...insertHistory, 
      id, 
      viewedAt: new Date() 
    };
    this.history.set(id, historyItem);
    return historyItem;
  }

  // Favorites operations
  async getFavorites(userId?: number): Promise<Favorite[]> {
    const favsArray = Array.from(this.favs.values());
    if (userId) {
      return favsArray.filter(f => f.userId === userId);
    }
    return favsArray;
  }

  async addFavorite(insertFavorite: InsertFavorite): Promise<Favorite> {
    const id = this.favIdCounter++;
    const favorite: Favorite = { 
      ...insertFavorite, 
      id, 
      addedAt: new Date() 
    };
    this.favs.set(id, favorite);
    return favorite;
  }

  async removeFavorite(id: number): Promise<void> {
    this.favs.delete(id);
  }

  async isFavorite(movieId: number, userId?: number): Promise<boolean> {
    const favsArray = Array.from(this.favs.values());
    if (userId) {
      return favsArray.some(f => f.movieId === movieId && f.userId === userId);
    }
    return favsArray.some(f => f.movieId === movieId);
  }
}

export const storage = new MemStorage();
