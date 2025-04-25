import { ServiceResponse } from "@/common/models/serviceResponse";
import { db } from "@/db/database.config";
import { blog, users } from "@/entities";
import { logger } from "@/server";
import type { BlogResponseType, BlogType, CreateBlogType, UpdateBlogType } from "@/types";
import { type SQLWrapper, and, eq, sql } from "drizzle-orm";
import { StatusCodes } from "http-status-codes";

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

class BlogService {
  async getBlogs(
    filters?: {
      blogHeader?: string;
    },
    pagination?: {
      page?: number;
      limit?: number;
    },
  ): Promise<ServiceResponse<PaginatedResponse<BlogResponseType> | null>> {
    try {
      const page = Math.max(1, Number(pagination?.page) || 1);
      const limit = Math.min(100, Math.max(1, Number(pagination?.limit) || 10));
      const offset = (page - 1) * limit;

      const whereConditions: Array<SQLWrapper | undefined> = [];
      if (filters?.blogHeader) {
        whereConditions.push(sql`LOWER(${blog.blogHeader}) LIKE LOWER(${`%${filters.blogHeader}%`})`);
      }
      
      const query = db
        .select({
          id: blog.id,
          blogPicUrl: blog.blogPicUrl ?? '',
          blogHeader: blog.blogHeader ?? '',
          blogBody: blog.blogBody ?? '',
          createdAt: blog.createdAt,
          updatedAt: blog.updatedAt,
          user: {
            id: users.id,
            fullName: users.fullName,
            userName: users.userName,
            email: users.email,
            country: users.country,
            phoneNumber: users.phoneNumber,
            companyName: users.companyName,
            role: users.role,
            createdAt: users.createdAt,
            updatedAt: users.updatedAt,
          }
        })
        .from(blog)
        .leftJoin(users, eq(blog.userId, users.id))
        .where(whereConditions.length ? and(...whereConditions) : undefined)
        .limit(limit)
        .offset(offset);

      const countQuery = db
        .select({ count: sql<number>`count(DISTINCT ${blog.id})` })
        .from(blog)
        .where(whereConditions.length ? and(...whereConditions) : undefined);

      const [blogsWithUsers, totalResult] = await Promise.all([query, countQuery]);
      const total = Number(totalResult[0]?.count) || 0;

      const Fetchedblogs: BlogResponseType[] = blogsWithUsers.map((blog) => ({
        ...blog,
        blogPicUrl: blog.blogPicUrl ?? '',
        user: blog.user ? {
          ...blog.user,
          password: '',
          otp: '',
          agreeTermsService: false,
          address: undefined,
          verifiedLicense: undefined
        } : undefined
      }));

      return ServiceResponse.success(
        "Blogs retrieved successfully",
        {
          data: Fetchedblogs,
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
          },
        },
        StatusCodes.OK,
      );
    } catch (error) {
      logger.error(`Error fetching blogs: ${error}`);
      return ServiceResponse.failure("Failed to retrieve blogs", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async createOrUpdateBlog(
    blogData: CreateBlogType,
    id: string,
    blogUrl?: string,
  ): Promise<ServiceResponse<BlogResponseType | null>> {
    try {
      const existingBlog = await db.query.blog.findFirst({
        where: (blog, { eq }) => eq(blog.id, id),
      });

      if (existingBlog) {
        const blogDataWithId = { ...blogData, blogUrl: blogUrl };
        const updatedBlog = await this.updateBlog(id, blogUrl ?? '', blogDataWithId);
        return ServiceResponse.success<BlogResponseType>(
          "Blog Updated Successfully",
          updatedBlog as BlogResponseType,
          StatusCodes.OK,
        );
      } else {
        const blogDataWithId = { 
          userId: id, 
          blogUrl: blogUrl,
          blogHeader: blogData.blogHeader,
          blogBody: blogData.blogBody,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        const createdBlog = await db.insert(blog).values(blogDataWithId).returning();
        return ServiceResponse.success<BlogResponseType>(
          "Blog Created Successfully",
          createdBlog[0] as BlogResponseType,
          StatusCodes.OK,
        );
      }
    } catch (error) {
      return ServiceResponse.failure<null>("Failed to create or update blog", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async getBlog(id: string): Promise<ServiceResponse<BlogResponseType | null>> {
    try {
      const [blogData] = await db
        .select({
          id: blog.id,
          userId: blog.userId,
          blogPicUrl: blog.blogPicUrl,
          blogHeader: blog.blogHeader,
          blogBody: blog.blogBody,
          createdAt: blog.createdAt,
          updatedAt: blog.updatedAt,
          user: {
            id: users.id,
            fullName: users.fullName,
            userName: users.userName,
            email: users.email,
            country: users.country,
            phoneNumber: users.phoneNumber,
            companyName: users.companyName,
            role: users.role,
            createdAt: users.createdAt,
            updatedAt: users.updatedAt,
          }
        })
        .from(blog)
        .leftJoin(users, eq(blog.userId, users.id))
        .where(eq(blog.id, id));

      if (!blogData) {
        return ServiceResponse.failure<null>("Blog not found", null, StatusCodes.NOT_FOUND);
      }

      const blogResponse: BlogResponseType = {
        ...blogData,
        blogPicUrl: blogData.blogPicUrl ?? '',
        user: blogData.user ? {
          ...blogData.user,
          password: '',
          otp: '',
          agreeTermsService: false,
          address: undefined,
          verifiedLicense: undefined
        } : undefined
      };

      return ServiceResponse.success<BlogResponseType>(
        "Blog Retrieved Successfully",
        blogResponse,
        StatusCodes.OK,
      );
    } catch (error) {
      logger.error(`Error fetching blog: ${error}`);
      return ServiceResponse.failure<null>("Failed to retrieve blog", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async getBlogForRegisteredUser(userId: string): Promise<ServiceResponse<BlogResponseType | null>> {
    try {
      const [blogData] = await db
        .select({
          id: blog.id,
          userId: blog.userId,
          blogPicUrl: blog.blogPicUrl,
          blogHeader: blog.blogHeader,
          blogBody: blog.blogBody,
          createdAt: blog.createdAt,
          updatedAt: blog.updatedAt,
          user: {
            id: users.id,
            fullName: users.fullName,
            userName: users.userName,
            email: users.email,
            country: users.country,
            phoneNumber: users.phoneNumber,
            companyName: users.companyName,
            role: users.role,
            createdAt: users.createdAt,
            updatedAt: users.updatedAt,
          }
        })
        .from(blog)
        .leftJoin(users, eq(blog.userId, users.id))
        .where(eq(blog.userId, userId));

      if (!blogData) {
        return ServiceResponse.success<null>(
          "No blog found for this user",
          null,
          StatusCodes.OK
        );
      }

      const blogResponse: BlogResponseType = {
        ...blogData,
        blogPicUrl: blogData.blogPicUrl ?? '',
        user: blogData.user ? {
          ...blogData.user,
          password: '',
          otp: '',
          agreeTermsService: false,
          address: undefined,
          verifiedLicense: undefined
        } : undefined
      };

      return ServiceResponse.success<BlogResponseType>(
        "Blog Retrieved Successfully",
        blogResponse,
        StatusCodes.OK,
      );
    } catch (error) {
      logger.info(error);
      return ServiceResponse.failure<null>("Failed to retrieve blogs", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteBlog(id: string): Promise<ServiceResponse<BlogType | null>> {
    try {
      const blogData = await db.delete(blog).where(eq(blog.id, id)).returning();
      const deletedBlog = blogData ? blogData[0] : null;
      return ServiceResponse.success<BlogType>(
        "Blog deleted Successfully",
        deletedBlog as BlogType,
        StatusCodes.OK,
      );
    } catch (error) {
      logger.error(`Error deleting blog: ${error}`);
      return ServiceResponse.failure<null>("Failed to delete blog", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async updateBlog(blogId: string, blogPicUrl: string, data: UpdateBlogType): Promise<BlogType | null> {
    try {
      const blogData = await db
        .update(blog)
        .set({ 
          ...data, 
          blogPicUrl: blogPicUrl, 
          updatedAt: new Date() 
        })
        .where(eq(blog.id, blogId))
        .returning();
      const updatedBlog = blogData ? blogData[0] : null;
      if (!updatedBlog) {
        return null;
      }
      return updatedBlog as BlogType;
    } catch (error) {
      logger.error(`Error updating blog: ${error}`);
      return null;
    }
  }
}

export const blogService = new BlogService();