import { z } from "zod";

export const createSectionSchema = z.object({
  name: z.string().min(1, "اسم القسم مطلوب"),
  slug: z.string().optional(),
  description: z.string().optional(),
  color: z.string().optional(),
  icon: z.string().optional(),
  sortOrder: z.number().int().optional(),
  isActive: z.boolean().optional(),
});

export const updateSectionSchema = createSectionSchema.partial();
