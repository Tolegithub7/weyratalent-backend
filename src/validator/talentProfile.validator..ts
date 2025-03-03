import { Experience, Gender } from "@/types";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);
export const TalentProfileSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  profile: z.custom<Express.Multer.File>().openapi({
    type: "string",
    format: "binary",
  }),
  fullName: z.string(),
  profileUrl: z.string().url(),
  nationality: z.string().openapi({
    description: "Nationality",
  }),
  dateOfBirth: z.string().openapi({
    description: "Date of Birth",
    default: "02-21-2002",
  }),
  gender: z.nativeEnum(Gender).openapi({
    description: "Gender",
    default: Gender.MALE,
  }),
  experience: z.nativeEnum(Experience).openapi({
    description: "Experience",
    default: Experience.MID_LEVEL,
  }),
  socialLink: z
    .string()
    .openapi({
      description: "Social Link",
    })
    .optional(),
  about: z
    .string()
    .openapi({
      description: "Bio information",
      default: "tell us about yourself",
    })
    .optional(),
});

export const GetTalentProfileSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export const CreateTalentProfileSchema = z.object({
  body: TalentProfileSchema.omit({ id: true, userId: true, profileUrl: true }),
});

export const UpdateTalentProfileSchema = TalentProfileSchema.omit({
  id: true,
  userId: true,
  profileUrl: true,
}).partial();
