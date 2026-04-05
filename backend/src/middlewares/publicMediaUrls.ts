import { Request, Response, NextFunction } from "express";
import { config } from "../config";
import { absolutizeUploadPaths } from "../utils/absolutizeUploadPaths";

/** When PUBLIC_MEDIA_BASE_URL is set, rewrite `/uploads/...` in JSON bodies from /api/public. */
export function publicMediaUrlsResponse(_req: Request, res: Response, next: NextFunction) {
  if (!config.publicMediaBase) return next();

  const originalJson = res.json.bind(res);
  res.json = (body: unknown) => originalJson(absolutizeUploadPaths(body));
  next();
}
