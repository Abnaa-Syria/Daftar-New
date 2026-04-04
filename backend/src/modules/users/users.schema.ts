import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(2, "الاسم مطلوب"),
  email: z.string().email("بريد إلكتروني غير صالح"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون ٦ أحرف على الأقل"),
  role: z.enum(["SUPER_ADMIN", "ADMIN", "EDITOR_IN_CHIEF", "EDITOR", "AUTHOR", "MEDIA_MANAGER"]).optional(),
});

export const updateUserSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  role: z.enum(["SUPER_ADMIN", "ADMIN", "EDITOR_IN_CHIEF", "EDITOR", "AUTHOR", "MEDIA_MANAGER"]).optional(),
  isActive: z.boolean().optional(),
});
