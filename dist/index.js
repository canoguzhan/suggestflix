// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
var MemStorage = class {
  users;
  movies;
  history;
  favs;
  userIdCounter;
  movieIdCounter;
  historyIdCounter;
  favIdCounter;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.movies = /* @__PURE__ */ new Map();
    this.history = /* @__PURE__ */ new Map();
    this.favs = /* @__PURE__ */ new Map();
    this.userIdCounter = 1;
    this.movieIdCounter = 1;
    this.historyIdCounter = 1;
    this.favIdCounter = 1;
  }
  // User operations
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  async createUser(insertUser) {
    const id = this.userIdCounter++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  // Movie operations
  async getMovie(id) {
    return this.movies.get(id);
  }
  async getMovieByTmdbId(tmdbId) {
    return Array.from(this.movies.values()).find(
      (movie) => movie.tmdbId === tmdbId
    );
  }
  async createMovie(insertMovie) {
    const id = this.movieIdCounter++;
    const movie = {
      ...insertMovie,
      id,
      addedAt: /* @__PURE__ */ new Date()
    };
    this.movies.set(id, movie);
    return movie;
  }
  // Movie history operations
  async getMovieHistory(userId) {
    const historyArray = Array.from(this.history.values());
    if (userId) {
      return historyArray.filter((h) => h.userId === userId);
    }
    return historyArray;
  }
  async addMovieToHistory(insertHistory) {
    const id = this.historyIdCounter++;
    const historyItem = {
      ...insertHistory,
      id,
      viewedAt: /* @__PURE__ */ new Date()
    };
    this.history.set(id, historyItem);
    return historyItem;
  }
  // Favorites operations
  async getFavorites(userId) {
    const favsArray = Array.from(this.favs.values());
    if (userId) {
      return favsArray.filter((f) => f.userId === userId);
    }
    return favsArray;
  }
  async addFavorite(insertFavorite) {
    const id = this.favIdCounter++;
    const favorite = {
      ...insertFavorite,
      id,
      addedAt: /* @__PURE__ */ new Date()
    };
    this.favs.set(id, favorite);
    return favorite;
  }
  async removeFavorite(id) {
    this.favs.delete(id);
  }
  async isFavorite(movieId, userId) {
    const favsArray = Array.from(this.favs.values());
    if (userId) {
      return favsArray.some((f) => f.movieId === movieId && f.userId === userId);
    }
    return favsArray.some((f) => f.movieId === movieId);
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull()
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true
});
var movies = pgTable("movies", {
  id: serial("id").primaryKey(),
  tmdbId: integer("tmdb_id").notNull().unique(),
  title: text("title").notNull(),
  posterPath: text("poster_path"),
  releaseDate: text("release_date"),
  overview: text("overview"),
  voteAverage: text("vote_average"),
  addedAt: timestamp("added_at").defaultNow()
});
var insertMovieSchema = createInsertSchema(movies).omit({
  id: true,
  addedAt: true
});
var movieHistory = pgTable("movie_history", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  movieId: integer("movie_id").notNull(),
  viewedAt: timestamp("viewed_at").defaultNow()
});
var insertMovieHistorySchema = createInsertSchema(movieHistory).omit({
  id: true,
  viewedAt: true
});
var favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  movieId: integer("movie_id").notNull(),
  addedAt: timestamp("added_at").defaultNow()
});
var insertFavoriteSchema = createInsertSchema(favorites).omit({
  id: true,
  addedAt: true
});
var tmdbMovieSchema = z.object({
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
      name: z.string()
    })
  ).optional()
});

// server/routes.ts
var TMDB_API_KEY = process.env.TMDB_API_KEY || process.env.VITE_TMDB_API_KEY || "";
async function registerRoutes(app2) {
  if (!TMDB_API_KEY) {
    console.error("TMDB_API_KEY is not set. The app will not function correctly.");
  }
  app2.get("/api/movies/random", async (req, res) => {
    try {
      const page = Math.floor(Math.random() * 500) + 1;
      const language = req.query.language || "en";
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
      const randomIndex = Math.floor(Math.random() * data.results.length);
      const randomMovie = data.results[randomIndex];
      const detailsResponse = await fetch(
        `https://api.themoviedb.org/3/movie/${randomMovie.id}?api_key=${TMDB_API_KEY}&language=${language}`
      );
      if (!detailsResponse.ok) {
        throw new Error(`TMDB API error fetching details: ${detailsResponse.status}`);
      }
      const movieDetails = await detailsResponse.json();
      const validatedMovie = tmdbMovieSchema.parse(movieDetails);
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
  app2.get("/api/movies/history", async (req, res) => {
    try {
      const history = await storage.getMovieHistory();
      const detailedHistory = [];
      for (const historyItem of history) {
        const movie = await storage.getMovie(historyItem.movieId);
        if (movie) {
          detailedHistory.push({
            ...historyItem,
            movie
          });
        }
      }
      detailedHistory.sort(
        (a, b) => new Date(b.viewedAt).getTime() - new Date(a.viewedAt).getTime()
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
  app2.post("/api/movies/favorites/toggle", async (req, res) => {
    try {
      const { movieId } = req.body;
      if (!movieId) {
        return res.status(400).json({ message: "Movie ID is required" });
      }
      const isFavorite = await storage.isFavorite(movieId);
      if (isFavorite) {
        const favorites2 = await storage.getFavorites();
        const favorite = favorites2.find((f) => f.movieId === movieId);
        if (favorite) {
          await storage.removeFavorite(favorite.id);
        }
        return res.status(200).json({
          favorite: false,
          message: "Movie removed from favorites"
        });
      } else {
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
  app2.get("/api/movies/favorites", async (req, res) => {
    try {
      const favorites2 = await storage.getFavorites();
      const detailedFavorites = [];
      for (const favorite of favorites2) {
        const movie = await storage.getMovie(favorite.movieId);
        if (movie) {
          detailedFavorites.push({
            ...favorite,
            movie
          });
        }
      }
      detailedFavorites.sort(
        (a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
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
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = process.env.PORT ? parseInt(process.env.PORT) : 5e3;
  server.listen({
    port,
    host: "localhost"
  }, () => {
    log(`serving on http://localhost:${port}`);
  });
})();
