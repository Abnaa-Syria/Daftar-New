import { config } from "../config";

/** Recursively prefix `/uploads/...` strings so the frontend can load files from the API host (Next.js image optimizer). */
export function absolutizeUploadPaths<T>(payload: T, mediaBase?: string): T {
  const base = mediaBase ?? config.publicMediaBase;
  if (!base || payload === null || payload === undefined) return payload;

  const rewrite = (v: unknown): unknown => {
    if (typeof v === "string" && v.startsWith("/uploads/")) return `${base}${v}`;
    if (Array.isArray(v)) return v.map(rewrite);
    if (v !== null && typeof v === "object") {
      if (v instanceof Date) return v;
      const o = v as Record<string, unknown>;
      const out: Record<string, unknown> = {};
      for (const key of Object.keys(o)) out[key] = rewrite(o[key]);
      return out;
    }
    return v;
  };

  return rewrite(payload) as T;
}
