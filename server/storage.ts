import { 
  users, type User, type InsertUser,
  movies, type Movie, type InsertMovie,
  movieHistory, type MovieHistory, type InsertMovieHistory,
  favorites, type Favorite, type InsertFavorite,
  type TmdbMovie,
  type ScheduledPost
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
  addMovieToHistory(movieHistory: { movieId: number; userId?: number | null }): Promise<MovieHistory>;
  
  // Favorites operations
  getFavorites(userId?: number): Promise<Favorite[]>;
  addFavorite(favorite: { movieId: number; userId?: number | null }): Promise<Favorite>;
  removeFavorite(id: number): Promise<void>;
  isFavorite(movieId: number, userId?: number): Promise<boolean>;

  // Scheduled posts operations
  getScheduledPosts(): Promise<ScheduledPost[]>;
  schedulePost(post: {
    movieId: number;
    message: string;
    scheduledFor: Date;
    platforms: {
      twitter: boolean;
      facebook: boolean;
      instagram: boolean;
    };
  }): Promise<ScheduledPost>;
  updatePostStatus(id: number, status: 'pending' | 'completed' | 'failed'): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private movies: Map<number, Movie>;
  private history: Map<number, MovieHistory>;
  private favs: Map<number, Favorite>;
  private scheduledPosts: Map<number, ScheduledPost>;
  private userIdCounter: number;
  private movieIdCounter: number;
  private historyIdCounter: number;
  private favIdCounter: number;
  private scheduledPostIdCounter: number;

  constructor() {
    this.users = new Map();
    this.movies = new Map();
    this.history = new Map();
    this.favs = new Map();
    this.scheduledPosts = new Map();
    this.userIdCounter = 1;
    this.movieIdCounter = 1;
    this.historyIdCounter = 1;
    this.favIdCounter = 1;
    this.scheduledPostIdCounter = 1;
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

  async addMovieToHistory(insertHistory: { movieId: number; userId?: number | null }): Promise<MovieHistory> {
    const id = this.historyIdCounter++;
    const historyItem: MovieHistory = { 
      ...insertHistory, 
      id,
      userId: insertHistory.userId || null,
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

  async addFavorite(insertFavorite: { movieId: number; userId?: number | null }): Promise<Favorite> {
    const id = this.favIdCounter++;
    const favorite: Favorite = { 
      ...insertFavorite, 
      id,
      userId: insertFavorite.userId || null,
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

  // Scheduled posts operations
  async getScheduledPosts(): Promise<ScheduledPost[]> {
    return Array.from(this.scheduledPosts.values());
  }

  async schedulePost(insertPost: {
    movieId: number;
    message: string;
    scheduledFor: Date;
    platforms: {
      twitter: boolean;
      facebook: boolean;
      instagram: boolean;
    };
  }): Promise<ScheduledPost> {
    const id = this.scheduledPostIdCounter++;
    const now = new Date();
    const post: ScheduledPost = {
      ...insertPost,
      id,
      platforms: typeof insertPost.platforms === 'string' 
        ? JSON.parse(insertPost.platforms)
        : insertPost.platforms,
      scheduledFor: new Date(insertPost.scheduledFor),
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    };
    this.scheduledPosts.set(id, post);
    return post;
  }

  async updatePostStatus(id: number, status: 'pending' | 'completed' | 'failed'): Promise<void> {
    const post = this.scheduledPosts.get(id);
    if (post) {
      this.scheduledPosts.set(id, {
        ...post,
        status,
        updatedAt: new Date(),
      });
    }
  }
}

export const storage = new MemStorage();
