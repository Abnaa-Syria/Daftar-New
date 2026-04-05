import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || "5000", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  },
  jwt: {
    secret: process.env.JWT_SECRET || "fallback-secret",
    refreshSecret: process.env.JWT_REFRESH_SECRET || "fallback-refresh",
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  },
  upload: {
    dir: process.env.UPLOAD_DIR || "uploads",
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || "5242880", 10),
  },
  /** Base URL (no trailing slash) where `/uploads/...` is reachable, e.g. https://back.aldaftar.news — used to rewrite paths in /api/public JSON for Next.js <Image>. */
  publicMediaBase: (process.env.PUBLIC_MEDIA_BASE_URL || "").replace(/\/+$/, "") || undefined,
};
