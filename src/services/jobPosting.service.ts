import { ServiceResponse } from "@/common/models/serviceResponse";
import { db } from "@/db/database.config";
import { jobProfile } from "@/entities";
import { logger } from "@/server";
import type { PaginationMeta } from "@/types/jobPosting.types";
import type { CreateJobPostingType, JobPostingType, UpdateJobPostingType } from "@/validator/jobPosting.validator";
import { and, eq, sql } from "drizzle-orm";
import { StatusCodes } from "http-status-codes";
import { v4 as uuidv4 } from "uuid";

class JobPostingService {
  async getJobPostings(
    filters?: {
      jobRole?: string;
      jobType?: string;
      jobLevel?: string;
    },
    pagination?: {
      page?: number;
      limit?: number;
    },
  ): Promise<ServiceResponse<{ data: JobPostingType[]; pagination: PaginationMeta } | null>> {
    try {
      // const page = pagination?.page || 1;
      // const limit = pagination?.limit || 10;
      // const offset = (page - 1) * limit;

      const page = Math.max(1, Number(pagination?.page) || 1);
      const limit = Math.min(100, Math.max(1, Number(pagination?.limit) || 10));
      const offset = (page - 1) * limit;

      const whereConditions = [];
      if (filters?.jobRole) whereConditions.push(eq(jobProfile.jobRole, filters.jobRole));
      if (filters?.jobType) whereConditions.push(eq(jobProfile.jobType, filters.jobType));
      if (filters?.jobLevel) whereConditions.push(eq(jobProfile.jobLevel, filters.jobLevel));

      const jobPostings = await db
        .select()
        .from(jobProfile)
        .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
        .limit(limit)
        .offset(offset);

      const totalResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(jobProfile)
        .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);
      const total = Number(totalResult[0]?.count) || 0;

      return ServiceResponse.success(
        "Job Postings Retrieved Successfully",
        {
          data: jobPostings as unknown as JobPostingType[],
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
      logger.error(error);
      return ServiceResponse.failure("Failed to retrieve job postings", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
  async createJobPosting(
    jobData: CreateJobPostingType,
    userId: string,
  ): Promise<ServiceResponse<JobPostingType | null>> {
    try {
      const jobDataWithId = {
        ...jobData,
        userId: userId,
        expiryDate: new Date(jobData.expiryDate),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const createdJob = await db.insert(jobProfile).values(jobDataWithId).returning();
      return ServiceResponse.success<JobPostingType>(
        "Job Posting Created Successfully",
        createdJob[0] as unknown as JobPostingType,
        StatusCodes.CREATED,
      );
    } catch (error) {
      logger.error(error);
      return ServiceResponse.failure<null>("Failed to create job posting", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async getJobPosting(id: string): Promise<ServiceResponse<JobPostingType | null>> {
    try {
      const jobData = await db.select().from(jobProfile).where(eq(jobProfile.id, id));
      const foundJob = jobData ? jobData[0] : null;
      return ServiceResponse.success<JobPostingType>(
        "Job Posting Retrieved Successfully",
        foundJob as unknown as JobPostingType,
        StatusCodes.OK,
      );
    } catch (error) {
      logger.error(error);
      return ServiceResponse.failure<null>("Failed to retrieve job posting", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async getRegisteredJob(userId: string): Promise<ServiceResponse<JobPostingType[] | null>> {
    try {
      const jobsData = await db.select().from(jobProfile).where(eq(jobProfile.userId, userId));
      return ServiceResponse.success<JobPostingType[]>(
        "Registered Jobs Retrieved Successfully",
        jobsData as unknown as JobPostingType[],
        StatusCodes.OK,
      );
    } catch (error) {
      return ServiceResponse.failure<null>(
        "Failed to retrieve registered jobs for the employer",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteJobPosting(id: string): Promise<ServiceResponse<JobPostingType | null>> {
    try {
      const jobData = await db.delete(jobProfile).where(eq(jobProfile.id, id)).returning();
      const deletedJob = jobData ? jobData[0] : null;
      return ServiceResponse.success<JobPostingType>(
        "Job Posting Deleted Successfully",
        deletedJob as unknown as JobPostingType,
        StatusCodes.OK,
      );
    } catch (error) {
      return ServiceResponse.failure<null>("Failed to delete job posting", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async updateJobPosting(id: string, data: UpdateJobPostingType): Promise<ServiceResponse<JobPostingType | null>> {
    try {
      const jobData = await db
        .update(jobProfile)
        // .set({ ...data, updatedAt: new Date() })

        .set({
          ...data,
          expiryDate: data.expiryDate ? new Date(data.expiryDate) : undefined,
          updatedAt: new Date(),
        })
        .where(eq(jobProfile.id, id))
        .returning();
      const updatedJob = jobData ? jobData[0] : null;
      return ServiceResponse.success<JobPostingType>(
        "Job Posting Updated Successfully",
        updatedJob as unknown as JobPostingType,
        StatusCodes.OK,
      );
    } catch (error) {
      return ServiceResponse.failure<null>("Failed to update job posting", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export const jobPostingService = new JobPostingService();
