import { Experience, Gender } from "@/types";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);
export const TalentProfileSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  fullName: z.string(),
  nationality: z.string(),
  dateOfBirth: z.string().default("02-21-2002"),
  gender: z.nativeEnum(Gender).default(Gender.MALE),
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
