import { ServiceResponse } from "@/common/models/serviceResponse";
import { db } from "@/db/database.config";
import { appliedJobs, cv, education, project, talentProfile, workExperience } from "@/entities";
import type { AppliedJobsType, GetApplicationsByJobIdType } from "@/types";
import { eq, sql } from "drizzle-orm";
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

  async getJobApplicationsByJobId(jobProfileId: string): Promise<ServiceResponse<GetApplicationsByJobIdType | null>> {
    try {
      const applicationData = await db
        .select({
          appliedJob: appliedJobs,
          talentCv: {
            ...cv, // Select all fields from cv
            education: sql`(
              SELECT COALESCE(JSON_AGG(
                ${education}.*
              ), '[]')
              FROM ${education}
              WHERE ${education.cvId} = ${cv.id}
            )`.as("education"),
            workExperience: sql`(
              SELECT COALESCE(JSON_AGG(
                ${workExperience}.*
              ), '[]')
              FROM ${workExperience}
              WHERE ${workExperience.cvId} = ${cv.id}
            )`.as("workExperience"),
            project: sql`(
              SELECT COALESCE(JSON_AGG(
                ${project}.*
              ), '[]')
              FROM ${project}
              WHERE ${project.cvId} = ${cv.id}
            )`.as("project"),
          },
          talentProfile: talentProfile,
        })
        .from(appliedJobs)
        .where(eq(appliedJobs.jobProfileId, jobProfileId))
        .leftJoin(cv, eq(appliedJobs.userId, cv.userId))
        .leftJoin(talentProfile, eq(appliedJobs.userId, talentProfile.userId));

      if (!applicationData || applicationData.length === 0) {
        return ServiceResponse.success<null>("No job applications found", null, StatusCodes.OK);
      }

      return ServiceResponse.success<GetApplicationsByJobIdType[]>(
        "Job Applications retrieved successfully",
        applicationData as unknown as GetApplicationsByJobIdType[],
        StatusCodes.OK,
      );
    } catch (error) {
      return ServiceResponse.failure<null>(
        "Failed to retrieve job applications",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
export const appliedJobsService = new AppliedJobsService();
