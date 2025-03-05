import type {
  CreateTalentProfileSchema,
  TalentProfileSchema,
  UpdateTalentProfileSchema,
} from "@/validator/talentProfile.validator.";
import type { z } from "zod";

export type TalentProfileType = z.infer<typeof TalentProfileSchema>;
export type CreateTalentProfileType = z.infer<typeof CreateTalentProfileSchema.shape.body>;

export type UpdateTalentProfileType = z.infer<typeof UpdateTalentProfileSchema>;