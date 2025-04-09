import { ServiceResponse } from "@/common/models/serviceResponse";
import { db } from "@/db/database.config";
import { cv, talentProfile } from "@/entities";
import { logger } from "@/server";
import type {
  CreateTalentProfileType,
  TalentProfileResponseType,
  TalentProfileType,
  UpdateTalentProfileType,
} from "@/types/talentProfile.types";
import { type SQLWrapper, and, eq, gte, lte, sql } from "drizzle-orm";
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
    filters?: {
      country?: string;
      experience?: string;
      minHourlyRate?: number;
      maxHourlyRate?: number;
    },
    pagination?: {
      page?: number;
      limit?: number;
    },
  ): Promise<ServiceResponse<PaginatedResponse<TalentProfileResponseType> | null>> {
    try {
      const page = Math.max(1, Number(pagination?.page) || 1);
      const limit = Math.min(100, Math.max(1, Number(pagination?.limit) || 10));
      const offset = (page - 1) * limit;

      const whereConditions: Array<SQLWrapper | undefined> = [];
      if (filters?.country) whereConditions.push(eq(talentProfile.country, filters.country));
      if (filters?.experience) whereConditions.push(eq(talentProfile.experience, filters.experience));
      if (filters?.minHourlyRate) whereConditions.push(gte(cv.hourlyRate, filters.minHourlyRate));
      if (filters?.maxHourlyRate) whereConditions.push(lte(cv.hourlyRate, filters.maxHourlyRate));

      // Join talentProfile with cv table
      const query = db
        .select({
          talentProfile: talentProfile, // Select all fields from talentProfile
          cv: cv, // Select all fields from cv
        })
        .from(talentProfile)
        .leftJoin(cv, eq(talentProfile.userId, cv.userId)) // Join with cv table using userId
        .where(whereConditions.length ? and(...whereConditions) : undefined)
        .limit(limit)
        .offset(offset);

      // Count query with the same join and filters
      const countQuery = db
        .select({ count: sql<number>`count(*)` })
        .from(talentProfile)
        .leftJoin(cv, eq(talentProfile.userId, cv.userId)) // Join with cv table
        .where(whereConditions.length ? and(...whereConditions) : undefined);

      const [profiles, totalResult] = await Promise.all([query, countQuery]);
      const total = Number(totalResult[0]?.count) || 0;

      const talentProfilesWithCv: TalentProfileResponseType[] = profiles.map((profile) => ({
        ...profile.talentProfile,
        talentCv: profile.cv || null,
      })) as unknown as TalentProfileResponseType[];

      return ServiceResponse.success(
        "Talent Profiles Retrieved Successfully",
        {
          data: talentProfilesWithCv as unknown as TalentProfileResponseType[],
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
      logger.error(`Error fetching talent profiles: ${error}`);
      return ServiceResponse.failure("Failed to retrieve talent profiles", null, StatusCodes.INTERNAL_SERVER_ERROR);
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

  async getTalentProfile(id: string): Promise<ServiceResponse<TalentProfileResponseType | null>> {
    try {
      const [talentData] = await db.select().from(talentProfile).where(eq(talentProfile.id, id));

      if (!talentData) {
        return ServiceResponse.failure<null>("Talent profile not found", null, StatusCodes.NOT_FOUND);
      }

      const [talentCv] = await db.select().from(cv).where(eq(cv.userId, talentData.userId));
      const talentProfileData = {
        ...talentData,
        talentCv: talentCv,
      };

      return ServiceResponse.success<TalentProfileResponseType>(
        "Talent Profile Retrieved Successfully",
        talentProfileData as unknown as TalentProfileResponseType,
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

  async getRegisteredTalentProfile(userId: string): Promise<ServiceResponse<TalentProfileResponseType | null>> {
    try {
      const talentData = await db.select().from(talentProfile).where(eq(talentProfile.userId, userId));
      const foundTalent = talentData ? talentData[0] : null;
      if (foundTalent) {
        const [talentCv] = await db.select().from(cv).where(eq(cv.userId, foundTalent.userId));
        const talentProfileData = {
          ...foundTalent,
          talentCv: talentCv,
        };

        return ServiceResponse.success<TalentProfileResponseType>(
          "Talent Profile Retrieved Successfully",
          talentProfileData as unknown as TalentProfileResponseType,
          StatusCodes.OK,
        );
      }

      return ServiceResponse.success<null>("Talent Profile Retrieved Succesfully", null, StatusCodes.OK);
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
