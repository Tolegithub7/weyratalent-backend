import { Experience } from "@/types";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);
export const TalentProfileSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  fullName: z.string(),
  nationality: z.string(),
  dateOfBirth: z.string(),
  gender: z.string().trim().min(4, "gender required").max(6),
  experience: z.nativeEnum(Experience).default(Experience.MID_LEVEL),
  socialLink: z.string().optional(),
  about: z.string().optional(),
});

export const GetTalentProfileSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export const CreateTalentProfileSchema = z.object({
  body: TalentProfileSchema.omit({ id: true, userId: true }),
});

export const UpdateTalentProfileSchema = TalentProfileSchema.partial();
