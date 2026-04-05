import express from "express";
import cors from "cors";
import path from "path";
import { config } from "./config";
import { errorHandler } from "./middlewares/errorHandler";
import { publicMediaUrlsResponse } from "./middlewares/publicMediaUrls";

// Admin routes
import authRoutes from "./modules/auth/auth.routes";
import usersRoutes from "./modules/users/users.routes";
import sectionsRoutes from "./modules/sections/sections.routes";
import seriesRoutes from "./modules/series/series.routes";
import articlesRoutes from "./modules/articles/articles.routes";
import authorsRoutes from "./modules/authors/authors.routes";
import tagsRoutes from "./modules/tags/tags.routes";
import breakingRoutes from "./modules/breaking/breaking.routes";
import infographicsRoutes from "./modules/infographics/infographics.routes";
import specialFilesRoutes from "./modules/special-files/special-files.routes";
import pagesRoutes from "./modules/pages/pages.routes";
import homepageRoutes from "./modules/homepage/homepage.routes";
import settingsRoutes from "./modules/settings/settings.routes";
import menusRoutes from "./modules/menus/menus.routes";
import mediaRoutes from "./modules/media/media.routes";

// Public routes
import publicRoutes from "./modules/public/public.routes";

const app = express();

// So req.secure / protocol match the client when behind nginx, TLS terminator, etc. (needed for inferred media URLs).
if (process.env.TRUST_PROXY === "1" || config.nodeEnv === "production") {
  app.set("trust proxy", 1);
}

// Middleware
app.use(
  cors({
    // In development, allow requests from localhost/IP hosts to avoid login failures caused by strict origin mismatch.
    origin: config.nodeEnv === "development" ? true : config.cors.origin,
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Static files
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Public API — optional absolute upload URLs for split frontend/API hosting
app.use("/api/public", publicMediaUrlsResponse);
app.use("/api/public", publicRoutes);

// Admin API
app.use("/api/admin/auth", authRoutes);
app.use("/api/admin/users", usersRoutes);
app.use("/api/admin/sections", sectionsRoutes);
app.use("/api/admin/series", seriesRoutes);
app.use("/api/admin/articles", articlesRoutes);
app.use("/api/admin/authors", authorsRoutes);
app.use("/api/admin/tags", tagsRoutes);
app.use("/api/admin/breaking", breakingRoutes);
app.use("/api/admin/infographics", infographicsRoutes);
app.use("/api/admin/special-files", specialFilesRoutes);
app.use("/api/admin/pages", pagesRoutes);
app.use("/api/admin/homepage-modules", homepageRoutes);
app.use("/api/admin/settings", settingsRoutes);
app.use("/api/admin/menus", menusRoutes);
app.use("/api/admin/media", mediaRoutes);

// Error handler


app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} ${res.statusCode}`);
  next();
});
app.use(errorHandler);

export default app;
