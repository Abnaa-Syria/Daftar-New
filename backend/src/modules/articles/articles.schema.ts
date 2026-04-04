import { z } from "zod";

export const createArticleSchema = z.object({
  title: z.string().min(1, "العنوان مطلوب"),
  slug: z.string().optional(),
  excerpt: z.string().optional(),
  content: z.string().optional(),
  image: z.string().optional(),
  sectionId: z.number().int().optional().nullable(),
  authorId: z.number().int().optional().nullable(),
  seriesId: z.number().int().optional().nullable(),
  status: z.enum(["DRAFT", "IN_REVIEW", "SCHEDULED", "PUBLISHED", "ARCHIVED"]).optional(),
  publishedAt: z.string().datetime().optional().nullable(),
  scheduledAt: z.string().datetime().optional().nullable(),
  readTime: z.number().int().optional(),
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
