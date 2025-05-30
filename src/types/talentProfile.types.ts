import type {
  CreateTalentProfileSchema,
  TalentProfileResponseSchmema,
  TalentProfileSchema,
  UpdateTalentProfileSchema,
} from "@/validator/talentProfile.validator.";
import type { z } from "zod";

export type TalentProfileType = z.infer<typeof TalentProfileSchema>;
export type CreateTalentProfileType = z.infer<typeof CreateTalentProfileSchema.shape.body>;

export type UpdateTalentProfileType = z.infer<typeof UpdateTalentProfileSchema>;
export interface PaginatedTalentProfileResponse {
  data: TalentProfileType[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
export type TalentProfileResponseType = z.infer<typeof TalentProfileResponseSchmema>;
