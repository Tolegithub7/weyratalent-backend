import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { UserSchema } from "./user.validator"; 

extendZodWithOpenApi(z);
export const BlogSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  blog: z
    .custom<Express.Multer.File>()
    .openapi({
      type: "string",
      format: "binary",
    })
    .optional(),
  blogPicUrl: z.string().url().optional(),
  blogHeader: z.string().openapi({
    description: "Header/Title of your blog",
    default: "something about the platform or any related thoughts",
  }),
  blogBody: z.string().openapi({
    description: "The main body of your blog",
    default: "explaining your thoughts",
  }),
  user: UserSchema.optional().openapi({ description: "The user who created the blog" }),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const GetBlogSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const CreateBlogSchema = z.object({
  body: BlogSchema.omit({
    id: true,
    userId: true,
    blogPicUrl: true,
  }),
});

export const UpdateBlogSchema = BlogSchema.omit({
  id: true,
  userId: true,
  blogPicUrl: true,
});
