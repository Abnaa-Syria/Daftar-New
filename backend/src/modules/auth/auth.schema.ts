import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("بريد إلكتروني غير صالح"),
  password: z.string().min(6, "كلمة المرور يجب أن تكون ٦ أحرف على الأقل"),
});

export type LoginInput = z.infer<typeof loginSchema>;
