import { z } from "zod";
import { isEmailLike, isPhoneLike, normalizePhone } from "@/lib/phone";

export const registerSchema = z
  .object({
    name: z.string().min(2, "Ном бояд ҳадди ақал 2 ҳарф бошад"),
    email: z.string().optional().default(""),
    phone: z.string().min(9, "Рақами телефонро ворид кунед"),
    password: z.string().min(6, "Парол бояд ҳадди ақал 6 ҳарф бошад"),
    passwordConfirm: z.string().min(1, "Паролро такрор кунед"),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.passwordConfirm) {
      ctx.addIssue({
        code: "custom",
        message: "Паролҳо мувофиқат намекунанд",
        path: ["passwordConfirm"],
      });
    }
    const email = data.email?.trim();
    if (email && !z.string().email().safeParse(email).success) {
      ctx.addIssue({
        code: "custom",
        message: "Email нодуруст аст",
        path: ["email"],
      });
    }
    const phoneDigits = normalizePhone(data.phone).replace(/\D/g, "");
    if (phoneDigits.length < 11) {
      ctx.addIssue({
        code: "custom",
        message: "Рақами телефон нодуруст аст (масалан +992 90 000 0000)",
        path: ["phone"],
      });
    }
  })
  .transform((data) => ({
    ...data,
    email: data.email?.trim() ? data.email.trim().toLowerCase() : undefined,
  }));

export const loginSchema = z
  .object({
    login: z.string().min(1, "Email ё телефони худро ворид кунед"),
    password: z.string().min(1, "Паролро ворид кунед"),
  })
  .superRefine((data, ctx) => {
    const value = data.login.trim();
    if (!isEmailLike(value) && !isPhoneLike(value)) {
      ctx.addIssue({
        code: "custom",
        message: "Email ё рақами телефонро дуруст ворид кунед",
        path: ["login"],
      });
    }
    if (isEmailLike(value) && !z.string().email().safeParse(value).success) {
      ctx.addIssue({
        code: "custom",
        message: "Email нодуруст аст",
        path: ["login"],
      });
    }
  });

export const listingSchema = z.object({
  title: z.string().min(3, "Сарлавҳа бояд ҳадди ақал 3 ҳарф бошад"),
  description: z.string().min(10, "Тавсиф бояд ҳадди ақал 10 ҳарф бошад"),
  price: z.coerce.number().min(0, "Нарх бояд мусбат бошад"),
  categoryId: z.string().min(1, "Категорияро интихоб кунед"),
  type: z.enum(["CLASSIFIED", "PRODUCT"]),
  condition: z.enum(["NEW", "USED", "REFURBISHED"]),
  location: z.string().optional(),
  images: z.array(z.string()).min(1, "Ҳадди ақал 1 расм илова кунед"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ListingInput = z.infer<typeof listingSchema>;
