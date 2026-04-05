import { Request } from "express";

/**
 * Builds the public origin for this API from proxy headers or Host, so `/uploads/...` can be
 * rewritten to absolute URLs without PUBLIC_MEDIA_BASE_URL when clients call the API on its real host
 * (e.g. https://back.aldaftar.news).
 */
export function inferPublicApiOrigin(req: Request): string | undefined {
  if (process.env.DISABLE_INFER_PUBLIC_MEDIA_BASE === "true") return undefined;

  const host =
    req.get("x-forwarded-host")?.split(",")[0]?.trim() ||
    req.get("host")?.trim();
  if (!host) return undefined;

  const proto =
    req.get("x-forwarded-proto")?.split(",")[0]?.trim() ||
    (req.secure ? "https" : "http");

  return `${proto}://${host}`.replace(/\/+$/, "");
}
