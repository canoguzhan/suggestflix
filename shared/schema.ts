import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table from original schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Movie schema for our application
export const movies = pgTable("movies", {
  id: serial("id").primaryKey(),
  tmdbId: integer("tmdb_id").notNull().unique(),
  title: text("title").notNull(),
  posterPath: text("poster_path"),
  releaseDate: text("release_date"),
  overview: text("overview"),
  voteAverage: text("vote_average"),
  addedAt: timestamp("added_at").defaultNow(),
});

export const insertMovieSchema = createInsertSchema(movies).omit({
  id: true,
  addedAt: true,
});

// Movie history schema
export const movieHistory = pgTable("movie_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  movieId: integer("movie_id").notNull(),
  viewedAt: timestamp("viewed_at").defaultNow(),
});

export const insertMovieHistorySchema = createInsertSchema(movieHistory).omit({
  id: true,
  viewedAt: true,
});

// Favorites schema
export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  movieId: integer("movie_id").notNull(),
  addedAt: timestamp("added_at").defaultNow(),
});

export const insertFavoriteSchema = createInsertSchema(favorites).omit({
  id: true,
  addedAt: true,
});

// TMDB API Response types
export const tmdbMovieSchema = z.object({
  id: z.number(),
  title: z.string(),
  poster_path: z.string().nullable(),
  backdrop_path: z.string().nullable(),
  release_date: z.string().optional(),
  overview: z.string(),
  vote_average: z.number(),
  runtime: z.number().optional(),
  genres: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
    })
  ).optional(),
  watch_providers: z.object({
    results: z.record(z.object({
      link: z.string(),
      flatrate: z.array(z.object({
        provider_id: z.number(),
        provider_name: z.string(),
        logo_path: z.string(),
      })).optional(),
      rent: z.array(z.object({
        provider_id: z.number(),
        provider_name: z.string(),
        logo_path: z.string(),
      })).optional(),
      buy: z.array(z.object({
        provider_id: z.number(),
        provider_name: z.string(),
        logo_path: z.string(),
      })).optional(),
    }))
  }).optional(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertMovie = z.infer<typeof insertMovieSchema>;
export type Movie = typeof movies.$inferSelect;

export type InsertMovieHistory = z.infer<typeof insertMovieHistorySchema>;
export type MovieHistory = typeof movieHistory.$inferSelect;

export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;
export type Favorite = typeof favorites.$inferSelect;

export type TmdbMovie = z.infer<typeof tmdbMovieSchema>;
