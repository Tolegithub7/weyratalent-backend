import { ServiceResponse } from "@/common/models/serviceResponse";
import { db } from "@/db/database.config";
import { employerProfile } from "@/entities";
import type {
  CreateEmployerProfileType,
  EmployerProfileType,
  UpdateEmployerProfileType,
} from "@/types/employerProfile.types";
import { eq } from "drizzle-orm";
import { StatusCodes } from "http-status-codes";
import { v4 as uuidv4 } from "uuid";

class EmployerProfileService {
  async getEmployerProfiles(): Promise<ServiceResponse<EmployerProfileType[] | null>> {
    try {
      const employerProfiles = await db.select().from(employerProfile);
      return ServiceResponse.success<EmployerProfileType[]>(
        "Employer Profiles Retrieved Successfully",
        employerProfiles as unknown as EmployerProfileType[],
        StatusCodes.OK,
      );
    } catch (error) {
      return ServiceResponse.failure<null>(
        "Failed to retrieve employer profiles",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createOrUpdateEmployerProfile(
    employerData: CreateEmployerProfileType,
    bannerUrl: string,
    logoUrl: string,
    userId: string,
  ): Promise<ServiceResponse<EmployerProfileType | null>> {
    try {
      const employerDataWithId = {
        ...employerData,
        userId: userId,
        bannerUrl: bannerUrl,
        logoUrl: logoUrl,
      };

      const existingEmployer = await db.query.employerProfile.findFirst({
        where: (employerProfile, { eq }) => eq(employerProfile.userId, userId),
      });

      if (existingEmployer) {
        const updatedEmployer = await this.updateEmployerProfile(userId, bannerUrl, logoUrl, employerDataWithId);
        return ServiceResponse.success<EmployerProfileType>(
          "Employer Profile Updated Successfully",
          updatedEmployer as unknown as EmployerProfileType,
          StatusCodes.OK,
        );
      } else {
        const createdEmployer = await db.insert(employerProfile).values(employerDataWithId).returning();
        return ServiceResponse.success<EmployerProfileType>(
          "Employer Profile Created Successfully",
          createdEmployer[0] as unknown as EmployerProfileType,
          StatusCodes.CREATED,
        );
      }
    } catch (error) {
      console.error("Error in createEmployerProfile:", error);
      return ServiceResponse.failure<null>(
        "Failed to create employer profile. Check server logs.",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getEmployerProfile(id: string): Promise<ServiceResponse<EmployerProfileType | null>> {
    try {
      const employerData = await db.select().from(employerProfile).where(eq(employerProfile.id, id));

      const foundEmployer = employerData ? employerData[0] : null;
      return ServiceResponse.success<EmployerProfileType>(
        "Employer Profile Retrieved Successfully",
        foundEmployer as unknown as EmployerProfileType,
        StatusCodes.OK,
      );
    } catch (error) {
      return ServiceResponse.failure<null>(
        "Failed to retrieve employer profile",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getRegisteredEmployerProfile(userId: string): Promise<ServiceResponse<EmployerProfileType | null>> {
    try {
      const employerData = await db.select().from(employerProfile).where(eq(employerProfile.userId, userId));

      const foundEmployer = employerData ? employerData[0] : null;
      return ServiceResponse.success<EmployerProfileType>(
        "Employer Profile Retrieved Successfully",
        foundEmployer as unknown as EmployerProfileType,
        StatusCodes.OK,
      );
    } catch (error) {
      return ServiceResponse.failure<null>(
        "Failed to retrieve employer profile",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteEmployerProfile(id: string): Promise<ServiceResponse<EmployerProfileType | null>> {
    try {
      const employerData = await db.delete(employerProfile).where(eq(employerProfile.id, id)).returning();

      const deletedEmployer = employerData ? employerData[0] : null;
      return ServiceResponse.success<EmployerProfileType>(
        "Employer Profile Deleted Successfully",
        deletedEmployer as unknown as EmployerProfileType,
        StatusCodes.OK,
      );
    } catch (error) {
      return ServiceResponse.failure<null>(
        "Failed to delete employer profile",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateEmployerProfile(
    userId: string,
    bannerUrl: string,
    logoUrl: string,
    data: UpdateEmployerProfileType,
  ): Promise<ServiceResponse<EmployerProfileType | null>> {
    try {
      const updatedData = {
        ...data,
        bannerUrl: bannerUrl,
        logoUrl: logoUrl,
        updatedAt: new Date(), // Ensure updatedAt is a Date object
        instagramLink: data.instagramLink || null,
        telegramLink: data.telegramLink || null,
        facebookLink: data.facebookLink || null,
        xLink: data.xLink || null,
      };

      const employerData = await db
        .update(employerProfile)
        .set(updatedData)
        .where(eq(employerProfile.userId, userId))
        .returning();

      const updatedEmployer = employerData ? employerData[0] : null;
      return ServiceResponse.success<EmployerProfileType>(
        "Employer Profile Updated Successfully",
        updatedEmployer as unknown as EmployerProfileType,
        StatusCodes.OK,
      );
    } catch (error) {
      return ServiceResponse.failure<null>(
        "Failed to update employer profile",
        null,
        StatusCodes.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

export const employerProfileService = new EmployerProfileService();