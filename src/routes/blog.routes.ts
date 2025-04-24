import { uploadImages } from "@/common/middleware/uploadMiddleware";
import { env } from "@/common/utils/envConfig";
import { validateRequest } from "@/common/utils/httpHandlers";
import { blogController } from "@/controllers/blog.controller";
import { BlogSchema, CreateBlogSchema, GetBlogSchema, UpdateBlogSchema } from "@/validator/blog.validator";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

export const blogRegistry = new OpenAPIRegistry();
export const blogRouter: Router = express.Router();
const BASE_API_PATH = env.BASE_API;

blogRouter.get("/", blogController.getBlogs);
blogRouter.get("/me", blogController.getBlogForRegisteredUser);
blogRouter.get("/:id", validateRequest(GetBlogSchema), blogController.getBlog);
blogRouter.post(
  "/",
  uploadImages.fields([
    {
      name: "blog",
      maxCount: 1,
    },
  ]),
  validateRequest(CreateBlogSchema),
  blogController.createOrUpdateBlog,
);

blogRouter.put(
  "/:id",
  uploadImages.fields([
    {
      name: "blog",
      maxCount: 1,
    },
  ]),
  validateRequest(CreateBlogSchema.partial()),
  blogController.createOrUpdateBlog,
);

blogRouter.delete("/:id", validateRequest(GetBlogSchema), blogController.deleteBlog);

const PaginatedBlogResponse = z.object({
  success: z.boolean(),
  data: z.array(BlogSchema),
  pagination: z.object({
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
  }),
});

blogRegistry.register("blog", BlogSchema);

// GET all blogs
blogRegistry.registerPath({
  method: "get",
  path: `${BASE_API_PATH}/blog`,
  security: [],
  tags: ["Blog"],
  request: {
    query: z.object({
      blogHeader: z.string().optional().describe("Search for blogs by title (e.g., the platform)"),
      page: z.number().int().positive().optional().default(1).describe("Page number (default: 1)"),
      limit: z.number().int().positive().optional().default(10).describe("Items per page (default: 10)"),
    }),
  },
  responses: {
    200: {
      description: "Paginated list of talent lists",
      content: {
        "application/json": {
          schema: PaginatedBlogResponse,
          examples: {
            default: {
              value: {
                success: true,
                data: [
                  {
                    id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                    blogHeader: "This is my blog",
                    blogBody: "This is a blog body",
                    // ... other fields
                  },
                ],
                pagination: {
                  total: 50,
                  page: 1,
                  limit: 10,
                  totalPages: 5,
                },
              },
            },
          },
        },
      },
    },
  },
});

// GET blogs for registered users
blogRegistry.registerPath({
  method: "get",
  path: `${BASE_API_PATH}/blog/me`,
  tags: ["Blog"],
  responses: {
    200: {
      description: "Success",
      content: { "application/json": { schema: BlogSchema } },
    },
  },
});

// GET blog by id
blogRegistry.registerPath({
  method: "get",
  path: `${BASE_API_PATH}/blog/{id}`,
  request: { params: GetBlogSchema.shape.params },
  tags: ["Blog"],
  responses: {
    200: {
      description: "Success",
      content: {
        "application/json": { schema: BlogSchema },
      },
    },
  },
});

// POST blog
blogRegistry.registerPath({
  method: "post",
  path: `${BASE_API_PATH}/blog`,
  tags: ["Blog"],
  request: {
    body: {
      required: true,
      content: {
        "multipart/form-data": {
          schema: CreateBlogSchema.shape.body,
          encoding: {
            file: {
              contentType: "*/*",
            },
          },
        },
      },
    },
  },
  responses: {
    201: {
      description: "Created",
      content: {
        "application/json": { schema: CreateBlogSchema },
      },
    },
  },
});

// DELETE blog
blogRegistry.registerPath({
  method: "delete",
  path: `${BASE_API_PATH}/blog/{id}`,
  tags: ["Blog"],
  request: { params: GetBlogSchema.shape.params },
  responses: {
    204: { description: "No Content" },
  },
});

// PUT blog
blogRegistry.registerPath({
  method: "put",
  path: `${BASE_API_PATH}/blog/{id}`,
  tags: ["Blog"],
  summary: "Update blog by id",
  request: {
    body: {
      required: true,
      content: {
        "multipart/form-data": {
          schema: UpdateBlogSchema,
          encoding: {
            file: {
              contentType: "*/*",
            },
          },
        },
      },
    },
    params: GetBlogSchema.shape.params,
  },
  responses: {
    200: {
      description: "Success",
      content: { "application/json": { schema: BlogSchema } },
    },
  },
});
