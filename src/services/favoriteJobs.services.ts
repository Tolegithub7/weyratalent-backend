import { ServiceResponse } from "@/common/models/serviceResponse";
import { db } from "@/db/database.config";
import { favoriteJobs } from "@/entities";
import type { FavoriteJobsType } from "@/types/favoriteJobs.types";
import { and, eq } from "drizzle-orm";
import { StatusCodes } from "http-status-codes";

class FavoriteJobsService {
  async getFavoriteJobs(): Promise<ServiceResponse<FavoriteJobsType[] | null>> {
    try {
      const retrievedFavorites = await db.select().from(favoriteJobs);
      return ServiceResponse.success<FavoriteJobsType[]>(
        "Favorite Jobs Retireved Success",
        retrievedFavorites,
        StatusCodes.OK,
      );
    } catch (error) {
      return ServiceResponse.failure<null>("Failed to retrieve favorite jobs", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async getFavoriteJob(userId: string, jobProfileId: string): Promise<ServiceResponse<FavoriteJobsType | null>> {
    try {
      const favoriteJobsData = await db
        .select()
        .from(favoriteJobs)
        .where(and(eq(favoriteJobs.userId, userId), eq(favoriteJobs.jobProfileId, jobProfileId)));
      const foundFavoriteJob = favoriteJobsData ? favoriteJobsData[0] : null;
      return ServiceResponse.success<FavoriteJobsType>(
        "Favorite Jobs retrieved successfully",
        foundFavoriteJob as unknown as FavoriteJobsType,
        StatusCodes.OK,
      );
    } catch (error) {
      return ServiceResponse.failure<null>("Failed to retrieve favorite job", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async getFavoriteJobForRegisteredUser(userId: string): Promise<ServiceResponse<FavoriteJobsType[] | null>> {
    try {
      const retrievedJobs = await db.select().from(favoriteJobs).where(eq(favoriteJobs.userId, userId));
      return ServiceResponse.success<FavoriteJobsType[]>(
        "Favorite Jobs for the given user retrieved successfully",
        retrievedJobs as unknown as FavoriteJobsType[],
        StatusCodes.OK,
      );
    } catch (error) {
      return ServiceResponse.failure<null>("Failed to retrieve favorite jobs", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async addFavoriteJob(userId: string, jobProfileId: string): Promise<ServiceResponse<FavoriteJobsType | null>> {
    try {
      const favoriteJob = {
        userId: userId,
        jobProfileId: jobProfileId,
      };
      const addedFavoriteJob = await db.insert(favoriteJobs).values(favoriteJob).returning();
      return ServiceResponse.success<FavoriteJobsType>(
        "Favorite job added successfully",
        addedFavoriteJob[0] as unknown as FavoriteJobsType,
        StatusCodes.CREATED,
      );
    } catch (error) {
      console.error("Failed to add favorite job:", error);
      return ServiceResponse.failure<null>(
        "Failed to create favorite job. Check server logs.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async removeFavoriteJob(jobProfileId: string, userId: string): Promise<ServiceResponse<FavoriteJobsType | null>> {
    try {
      const favoriteJobData = await db
        .delete(favoriteJobs)
        .where(and(eq(favoriteJobs.userId, userId), eq(favoriteJobs.jobProfileId, jobProfileId)))
        .returning();
      const removedFavoriteJob = favoriteJobData ? favoriteJobData[0] : null;
      return ServiceResponse.success<FavoriteJobsType>(
        "Favorite job removed Successfully",
        removedFavoriteJob as unknown as FavoriteJobsType,
        StatusCodes.OK,
      );
    } catch (error) {
      console.error("Failed to remove favorite job:", error);
      return ServiceResponse.failure<null>(
        "Failed to remove favorite job. Check server logs.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

export const favoriteJobsService = new FavoriteJobsService();
