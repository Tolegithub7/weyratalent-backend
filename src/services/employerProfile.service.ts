import { ServiceResponse } from "@/common/models/serviceResponse";
import { db } from "@/db/database.config";
import { employerProfile } from "@/entities";
import { eq } from "drizzle-orm";
import { StatusCodes } from "http-status-codes";

class EmployerProfileService {
  async createEmployerProfile(data: any) {
    try {
      const [created] = await db.insert(employerProfile).values(data).returning();
      return ServiceResponse.success("Profile created", created, StatusCodes.CREATED);
    } catch (error) {
      return ServiceResponse.failure("Creation failed", StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async getEmployerProfile(id: string) {
    try {
      const [profile] = await db.select().from(employerProfile).where(eq(employerProfile.id, id));
      return profile 
        ? ServiceResponse.success("Profile found", profile, StatusCodes.OK)
        : ServiceResponse.failure("Not found", StatusCodes.NOT_FOUND);
    } catch (error) {
      return ServiceResponse.failure("Fetch failed", StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async updateEmployerProfile(id: string, updates: any) {
    try {
      const [updated] = await db
        .update(employerProfile)
        .set({ ...updates, updatedAt: new Date() })
        .where(eq(employerProfile.id, id))
        .returning();
      return ServiceResponse.success("Profile updated", updated, StatusCodes.OK);
    } catch (error) {
      return ServiceResponse.failure("Update failed", StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteEmployerProfile(id: string) {
    try {
      await db.delete(employerProfile).where(eq(employerProfile.id, id));
      return ServiceResponse.success("Profile deleted", null, StatusCodes.NO_CONTENT);
    } catch (error) {
      return ServiceResponse.failure("Deletion failed", StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export const employerProfileService = new EmployerProfileService();