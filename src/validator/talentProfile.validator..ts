import { Country, Experience, Gender, Nationality } from "@/types";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);
export const TalentProfileSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  profileUrl: z.string().url().optional(),
  fullName: z.string().min(1, "Full name is required"),
  country: z.nativeEnum(Country),
  personalWebsite: z.string().optional(),
  nationality: z.nativeEnum(Nationality),
  dateOfBirth: z.string().default("02-21-2002"),
  // dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
  gender: z.nativeEnum(Gender).default(Gender.MALE),
  experience: z.nativeEnum(Experience).default(Experience.MID_LEVEL),
  socialLink: z.string().optional(),
  about: z.string().optional(),
});

export const GetTalentProfileSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const CreateTalentProfileSchema = z.object({
  body: TalentProfileSchema.omit({ id: true, userId: true }),
});

export const UpdateTalentProfileSchema = z.object({
  body: TalentProfileSchema.omit({ id: true, userId: true }).partial(),
});
