import type { BlogSchema, CreateBlogSchema, UpdateBlogSchema } from "@/validator/blog.validator";
import type { z } from "zod";

export type BlogType = z.infer<typeof BlogSchema>;
export type CreateBlogType = z.infer<typeof CreateBlogSchema.shape.body>;
export type UpdateBlogType = z.infer<typeof UpdateBlogSchema>;

export type BlogResponseType = z.infer<typeof BlogSchema>;
export interface PaginatedBlogResponseType {
  data: BlogType[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
