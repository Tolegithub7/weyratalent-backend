import fs from "node:fs";
import path from "node:path";
import { ApiError } from "@/common/models/serviceResponse";
import type { ServiceResponse } from "@/common/models/serviceResponse";
import { catchAsync } from "@/common/utils/catchAsync.util";
import { handleImageUpload } from "@/common/utils/handleFileUploads";
import { handleServiceResponse } from "@/common/utils/httpHandlers";
import { blogService } from "@/services/blog.service";
import type { BlogType } from "@/types";
import { BucketNameEnum } from "@/types/minio.types";
import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

class BlogController {
  public createOrUpdateBlog = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
    }

    const userId = req.user.id;
    const id = req.params.id;
    let createdBlogResponse: ServiceResponse<BlogType | null> = {} as ServiceResponse<BlogType | null>;
    if (id !== undefined) {
      createdBlogResponse = await blogService.createOrUpdateBlog(req.body, id);
    }

    let blogUrl = "";
    if (id === undefined) {
      createdBlogResponse = await blogService.createOrUpdateBlog(req.body, userId, blogUrl);
      if (createdBlogResponse.success === false) {
        return handleServiceResponse(createdBlogResponse, res);
      }
    }

    const blogId = createdBlogResponse.responseObject?.id;
    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      if (files?.blog?.[0]) {
        const blogFilePath = path.join(files.blog[0].destination, files.blog[0].filename);
        console.log(blogFilePath);

        try {
          blogUrl = await handleImageUpload(
            files.blog[0].filename,
            blogId ? blogId : "",
            blogFilePath,
            BucketNameEnum.BLOG,
          );
        } catch (error) {
          if (fs.existsSync(blogFilePath)) {
            fs.unlinkSync(blogFilePath);
          }
          throw new ApiError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            `Failed to upload profile image: ${(error as Error).message}`,
          );
        }
      }

      const serviceResponse = await blogService.createOrUpdateBlog({} as any, blogId ? blogId : "", blogUrl);
      return handleServiceResponse(serviceResponse, res);
    }

    return handleServiceResponse(createdBlogResponse, res);
  });

  public getBlog = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const serviceResponse = await blogService.getBlog(id);
    return handleServiceResponse(serviceResponse, res);
  });

  public getBlogs = catchAsync(async (req: Request, res: Response) => {
    const { blogHeader, page = 1, limit = 10 } = req.query;
    const serviceResponse = await blogService.getBlogs(
      {
        blogHeader: blogHeader as string,
      },
      {
        page: Number(page),
        limit: Number(limit),
      },
    );

    return handleServiceResponse(serviceResponse, res);
  });

  public deleteBlog = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const serviceResponse = await blogService.deleteBlog(id);
    return handleServiceResponse(serviceResponse, res);
  });

  public getBlogForRegisteredUser = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
    }

    const userId = req.user.id;
    const serviceResponse = await blogService.getBlogForRegisteredUser(userId);
    return handleServiceResponse(serviceResponse, res);
  });
}

export const blogController = new BlogController();
