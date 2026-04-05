import { Request, Response, NextFunction } from "express";
import { config } from "../config";
import { absolutizeUploadPaths } from "../utils/absolutizeUploadPaths";
import { inferPublicApiOrigin } from "../utils/inferPublicApiOrigin";

/**
 * Rewrites `/uploads/...` in /api/public JSON to absolute URLs.
 * Uses PUBLIC_MEDIA_BASE_URL when set; otherwise infers origin from the request (Host / X-Forwarded-*).
 */
export function publicMediaUrlsResponse(req: Request, res: Response, next: NextFunction) {
  const mediaBase = config.publicMediaBase ?? inferPublicApiOrigin(req);
  if (!mediaBase) return next();

  const originalJson = res.json.bind(res);
  res.json = (body: unknown) => originalJson(absolutizeUploadPaths(body, mediaBase));
  next();
}
