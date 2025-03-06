import { ServiceResponse } from "@/common/models/serviceResponse";
import { db } from "@/db/database.config";
import { appliedJobs } from "@/entities";
import type { AppliedJobsType } from "@/types";
import { eq } from "drizzle-orm";
import { StatusCodes } from "http-status-codes";

class AppliedJobsService {
  async getJobApplications(): Promise<ServiceResponse<AppliedJobsType[] | null>> {
    try {
      const retrievedApplied = await db.select().from(appliedJobs);
      return ServiceResponse.success<AppliedJobsType[]>(
        "Applied Jobs Retrieved Successfully",
        retrievedApplied as unknown as AppliedJobsType[],
        StatusCodes.OK,
      );
    } catch (error) {
      return ServiceResponse.failure<null>("Failed to retrieve applied jobs", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async newApplication(
    userId: string,
    jobProfileId: string,
    coverLetter: string,
  ): Promise<ServiceResponse<AppliedJobsType | null>> {
    try {
      const appliedJobWithId = {
        coverLetter: coverLetter,
        userId: userId,
        jobProfileId: jobProfileId,
      };

      const createdApplication = await db.insert(appliedJobs).values(appliedJobWithId).returning();
      return ServiceResponse.success<AppliedJobsType>(
        "Job application created successfully",
        createdApplication[0] as unknown as AppliedJobsType,
        StatusCodes.CREATED,
      );
    } catch (error) {
      console.error("Error in newApplication:", error);
      return ServiceResponse.failure<null>(
        "Failed to create application. Check server logs.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getApplicationForRegisteredTalent(userId: string): Promise<ServiceResponse<AppliedJobsType[] | null>> {
    try {
      const applicationsData = await db.select().from(appliedJobs).where(eq(appliedJobs.userId, userId));
      return ServiceResponse.success<AppliedJobsType[]>(
        "Job Applications retrieved successfully",
        applicationsData as unknown as AppliedJobsType[],
        StatusCodes.OK,
      );
    } catch (error) {
      return ServiceResponse.failure<null>(
        "Failed to retrieve applications data",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getApplication(applicationId: string): Promise<ServiceResponse<AppliedJobsType | null>> {
    try {
      const applicationData = await db.select().from(appliedJobs).where(eq(appliedJobs.id, applicationId));
      const foundApplication = applicationData ? applicationData[0] : null;
      return ServiceResponse.success<AppliedJobsType>(
        "Job Applications retrieved successfully",
        foundApplication as unknown as AppliedJobsType,
        StatusCodes.OK,
      );
    } catch (error) {
      return ServiceResponse.failure<null>(
        "Failed to retrieve application with the specified Id",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

export const appliedJobsService = new AppliedJobsService();
