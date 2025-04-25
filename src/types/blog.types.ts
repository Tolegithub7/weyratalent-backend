import type { BlogSchema, CreateBlogSchema, UpdateBlogSchema } from "@/validator/blog.validator";
import type { z } from "zod";
import type { UserType } from "./user.types";

export type BlogType = z.infer<typeof BlogSchema>;
export type CreateBlogType = z.infer<typeof CreateBlogSchema.shape.body>;
export type UpdateBlogType = z.infer<typeof UpdateBlogSchema>;

// export type BlogResponseType = z.infer<typeof BlogSchema> & {
//   user?: UserType;
// };
export interface PaginatedBlogResponseType {
  data: BlogType[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
export type BlogResponseType = {
  id: string;
  userId: string;
  blogPicUrl: string;
  blogHeader: string;
  blogBody: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    fullName: string | null;
    userName: string | null;
    email: string;
    country: string;
    phoneNumber: string | null;
    companyName: string | null;
    role: string;
    createdAt: string;
    updatedAt: string;
  };
};
