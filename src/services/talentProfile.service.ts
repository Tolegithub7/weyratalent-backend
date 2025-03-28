import { ServiceResponse } from "@/common/models/serviceResponse";
import { db } from "@/db/database.config";
import { talentProfile } from "@/entities";
import { logger } from "@/server";
import type { CreateTalentProfileType, TalentProfileType, UpdateTalentProfileType } from "@/types/talentProfile.types";
import { eq, and, SQLWrapper, sql } from "drizzle-orm";
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
class TalentProfileService {

  async getTalentProfiles(
    pagination?: {
      page?: number;
      limit?: number;
    }
  ): Promise<ServiceResponse<PaginatedResponse<TalentProfileType> | null>> {
    try {
      const page = Math.max(1, Number(pagination?.page) || 1);
      const limit = Math.min(100, Math.max(1, Number(pagination?.limit) || 10));
      const offset = (page - 1) * limit;
      
      const whereConditions: Array<SQLWrapper | undefined> = [];
      const query = db
        .select()
        .from(talentProfile)
        .where(whereConditions.length ? and(...whereConditions) : undefined)
        .limit(limit)
        .offset(offset);

      const countQuery = db
        .select({ count: sql<number>`count(*)` })
        .from(talentProfile)
        .where(whereConditions.length ? and(...whereConditions) : undefined);
  
      const [profiles, totalResult] = await Promise.all([query, countQuery]);
      const total = Number(totalResult[0]?.count) || 0;

      const talentProfiles = await db.select().from(talentProfile);
      return ServiceResponse.success(
        "Talent Profiles Retrieved Successfully",
        {
          data: profiles as unknown as TalentProfileType[],
          pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
          },
        },
        StatusCodes.OK
      );
    } catch (error) {
      logger.error(`Error fetching talent profiles: ${error}`);
      return ServiceResponse.failure(
        "Failed to retrieve talent profiles",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }  
  }

  async createOrUpdateTalentProfile(
    talentData: CreateTalentProfileType,
    profileUrl: string,
    userId: string,
  ): Promise<ServiceResponse<TalentProfileType | null>> {
    try {
      const talentDataWithId = { ...talentData, userId: userId, profileUrl: profileUrl };

      // Check if a talent profile with the given userId already exists
      const existingTalent = await db.query.talentProfile.findFirst({
        where: (talentProfile, { eq }) => eq(talentProfile.userId, userId),
      });

      if (existingTalent) {
        const updatedTalent = await this.updateTalentProfile(userId, profileUrl, talentDataWithId);
        return ServiceResponse.success<TalentProfileType>(
          "Talent Profile Updated Successfully",
          updatedTalent as unknown as TalentProfileType,
          StatusCodes.OK,
        );
      } else {
        const createdTalent = await db.insert(talentProfile).values(talentDataWithId).returning();
        return ServiceResponse.success<TalentProfileType>(
          "Talent Profile Created Successfully",
          createdTalent[0] as unknown as TalentProfileType,
          StatusCodes.OK,
        );
      }
    } catch (error) {
      console.log(error);
      return ServiceResponse.failure<null>(
        "Failed to create or update talent profile",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getTalentProfile(id: string): Promise<ServiceResponse<TalentProfileType | null>> {
    try {
      const [talentData] = await db.select().from(talentProfile).where(eq(talentProfile.id, id));

      if (!talentData) {
        return ServiceResponse.failure<null>("Talent profile not found", null, StatusCodes.NOT_FOUND);
      }

      return ServiceResponse.success<TalentProfileType>(
        "Talent Profile Retrieved Successfully",
        talentData as TalentProfileType,
        StatusCodes.OK,
      );
    } catch (error) {
      logger.error(`Error fetching talent profile: ${error}`);
      return ServiceResponse.failure<null>(
        "Failed to retrieve talent profile",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getRegisteredTalentProfile(userId: string): Promise<ServiceResponse<TalentProfileType | null>> {
    try {
      const talentData = await db.select().from(talentProfile).where(eq(talentProfile.userId, userId));
      const foundTalent = talentData ? talentData[0] : null;
      return ServiceResponse.success<TalentProfileType>(
        "Talent Profile Retrieved Succesfully",
        foundTalent as unknown as TalentProfileType,
        StatusCodes.OK,
      );
    } catch (error) {
      logger.info(error);
      return ServiceResponse.failure<null>(
        "Failed to retrieve talent profile",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteTalentProfile(id: string): Promise<ServiceResponse<TalentProfileType | null>> {
    try {
      const talentData = await db.delete(talentProfile).where(eq(talentProfile.id, id)).returning();
      const deletedTalent = talentData ? talentData[0] : null;
      return ServiceResponse.success<TalentProfileType>(
        "Talent Profiles deleted Succesfully",
        deletedTalent as unknown as TalentProfileType,
        StatusCodes.OK,
      );
    } catch (error) {
      logger.error(`Error deleting talent profile: ${error}`);
      return ServiceResponse.failure<null>("Failed to delete talent profile", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async updateTalentProfile(
    userId: string,
    profileUrl: string,
    data: UpdateTalentProfileType,
  ): Promise<ServiceResponse<TalentProfileType | null>> {
    try {
      const talentData = await db
        .update(talentProfile)
        .set({ ...data, profileUrl: profileUrl, updatedAt: new Date() })
        .where(eq(talentProfile.userId, userId))
        .returning();
      const updatedTalent = talentData ? talentData[0] : null;
      if (!updatedTalent) {
        return ServiceResponse.failure<null>("Talent profile not found", null, StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success<TalentProfileType>(
        "Talent Profile updated Succesfully",
        updatedTalent as unknown as TalentProfileType,
        StatusCodes.OK,
      );
    } catch (error) {
      logger.error(`Error updating talent profile: ${error}`);
      return ServiceResponse.failure<null>("Failed to update talent profile", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export const talentProfileService = new TalentProfileService();
