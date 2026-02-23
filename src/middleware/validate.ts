
import { z } from "zod";
import { Request, Response, NextFunction } from "express";

export const blogCreateSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  userId: z.coerce.number().int().positive("userId must be a positive integer"),
  //imageUrl: z.string().optional() // Optional image URL, will be set by multer if file uploaded
});

export const blogUpdateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional()
});

export const imageCreateSchema = z.object({
  caption: z.string().min(1),
  userId: z.coerce.number().int().positive()
});

export const commentCreateSchema = z.object({
  userId: z.number().int().positive(),
  text: z.string().min(1)
});

export function validate<T extends z.ZodTypeAny>(schema: T) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ error: "Validation failed", details: result.error.issues });
    }
    req.body = result.data as any;
    next();
  };
}
