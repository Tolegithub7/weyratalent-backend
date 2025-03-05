import { ServiceResponse } from "@/common/models/serviceResponse";
import { db } from "@/db/database.config";
import { talentProfile } from "@/entities";
import { logger } from "@/server";
import type { CreateTalentProfileType, TalentProfileType, UpdateTalentProfileType } from "@/types/talentProfile.types";
import { eq } from "drizzle-orm";
import { StatusCodes } from "http-status-codes";
class TalentProfileService {
async getTalentProfiles(): Promise<ServiceResponse<TalentProfileType[] | null>> {
try {
const talentProfiles = await db.select().from(talentProfile);
return ServiceResponse.success<TalentProfileType[]>(
"Talent Profiles Retrieved Succesfully",
talentProfiles as unknown as TalentProfileType[],
StatusCodes.OK,
);
} catch (error) {
logger.error(`Error fetching talent profiles: ${error}`);
return ServiceResponse.failure<null>(
"Failed to retrieve talent profiles",
null,
StatusCodes.INTERNAL_SERVER_ERROR,
);
}
}

async createTalentProfile(
talentData: CreateTalentProfileType,
userId: string,
): Promise<ServiceResponse<TalentProfileType | null>> {
try {
const talentDataWithId = { ...talentData, userId: userId };
const createdTalent = await db.insert(talentProfile).values(talentDataWithId).returning();
return ServiceResponse.success<TalentProfileType>(
"Talent Profile Created Succesfully",
createdTalent[0] as unknown as TalentProfileType,
StatusCodes.OK,
);
} catch (error) {
logger.error(`Error creating talent profile: ${error}`);
return ServiceResponse.failure<null>("Failed to create talent profile", null, StatusCodes.INTERNAL_SERVER_ERROR);
}
}

async getTalentProfile(id: string): Promise<ServiceResponse<TalentProfileType | null>> {
try {
const [talentData] = await db
.select()
.from(talentProfile)
.where(eq(talentProfile.id, id));

if (!talentData) {
return ServiceResponse.failure<null>(
"Talent profile not found",
null,
StatusCodes.NOT_FOUND
);
}

return ServiceResponse.success<TalentProfileType>(
"Talent Profile Retrieved Successfully",
talentData as TalentProfileType,
StatusCodes.OK
);
} catch (error) {
logger.error(`Error fetching talent profile: ${error}`);
return ServiceResponse.failure<null>(
"Failed to retrieve talent profile",
null,
StatusCodes.INTERNAL_SERVER_ERROR
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
id: string,
data: UpdateTalentProfileType,
): Promise<ServiceResponse<TalentProfileType | null>> {
try {
const talentData = await db
.update(talentProfile)
.set({ ...data, updatedAt: new Date() })
.where(eq(talentProfile.id, id))
.returning();
const updatedTalent = talentData ? talentData[0] : null;
if (!updatedTalent) {
return ServiceResponse.failure<null>(
"Talent profile not found",
null,
StatusCodes.NOT_FOUND
);
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
