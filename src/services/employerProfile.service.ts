import { ServiceResponse } from "@/common/models/serviceResponse";
import { db } from "@/db/database.config";
import { employerProfile } from "@/entities";
<<<<<<< Updated upstream
import type {
  CreateEmployerProfileType,
  EmployerProfileType,
  UpdateEmployerProfileType,
} from "@/types/employerProfile.types";
=======
import type { CreateEmployerProfileType, EmployerProfileType, UpdateEmployerProfileType } from "@/types/employerProfile.types";
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
  async createEmployerProfile(
    employerData: CreateEmployerProfileType,
  ): Promise<ServiceResponse<EmployerProfileType | null>> {
=======
  async createEmployerProfile(employerData: CreateEmployerProfileType): Promise<ServiceResponse<EmployerProfileType | null>> {
>>>>>>> Stashed changes
    try {
      const userId = uuidv4();
      const employerDataWithId = { ...employerData, userId: userId };
      const createdEmployer = await db.insert(employerProfile).values(employerDataWithId).returning();
      return ServiceResponse.success<EmployerProfileType>(
        "Employer Profile Created Successfully",
        createdEmployer[0] as unknown as EmployerProfileType,
        StatusCodes.CREATED,
      );
    } catch (error) {
      return ServiceResponse.failure<null>(
        "Failed to create employer profile",
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
    id: string,
    data: UpdateEmployerProfileType,
  ): Promise<ServiceResponse<EmployerProfileType | null>> {
    try {
      const employerData = await db
        .update(employerProfile)
        .set({ ...data, updatedAt: new Date() })
        .where(eq(employerProfile.id, id))
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

<<<<<<< Updated upstream
export const employerProfileService = new EmployerProfileService();
=======
export const employerProfileService = new EmployerProfileService();
>>>>>>> Stashed changes
