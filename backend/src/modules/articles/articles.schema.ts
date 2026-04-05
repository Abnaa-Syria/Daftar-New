import { z } from "zod";

/** HTML datetime-local (YYYY-MM-DDTHH:mm) or full ISO-8601 → normalized ISO string for Prisma. */
function optionalDateTimeField() {
  return z.preprocess(
    (val) => {
      if (val === null) return null;
      if (val === undefined || val === "") return undefined;
      const s = String(val).trim();
      if (!s) return undefined;
      const localMinute = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
      const toParse = localMinute.test(s) ? `${s}:00` : s;
      const d = new Date(toParse);
      return Number.isNaN(d.getTime()) ? val : d.toISOString();
    },
    z.union([z.string().datetime(), z.undefined(), z.null()])
  );
}

const optionalIntId = z.preprocess(
  (val) => {
    if (val === null) return null;
    if (val === undefined || val === "") return undefined;
    return val;
  },
  z.union([z.coerce.number().int(), z.undefined(), z.null()])
);

export const createArticleSchema = z.object({
  title: z.string().min(1, "العنوان مطلوب"),
  slug: z.string().optional(),
  excerpt: z.string().optional(),
  content: z.string().optional(),
  image: z.string().optional(),
  sectionId: optionalIntId,
  authorId: optionalIntId,
  seriesId: optionalIntId,
  status: z.enum(["DRAFT", "IN_REVIEW", "SCHEDULED", "PUBLISHED", "ARCHIVED"]).optional(),
  publishedAt: optionalDateTimeField(),
  scheduledAt: optionalDateTimeField(),
  readTime: z.number().int().optional(),
  views: z.number().int().optional(),
  isFeatured: z.boolean().optional(),
  isBreaking: z.boolean().optional(),
  isExclusive: z.boolean().optional(),
  isAnalysis: z.boolean().optional(),
  isPinnedHome: z.boolean().optional(),
  isPinnedSection: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  ogImage: z.string().optional(),
  tagIds: z.array(z.number().int()).optional(),
  galleryImages: z.array(z.string()).optional(),
});

export const updateArticleSchema = createArticleSchema.partial();
