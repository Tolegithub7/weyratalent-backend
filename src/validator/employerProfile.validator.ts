import { IndustryType, OrganizationType, TeamSize } from "@/types/employerProfile.types";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const EmployerProfileSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  logoUrl: z.string().url().optional(),
  bannerUrl: z.string().url(),
  companyName: z.string().min(1).max(100),
  about: z.string().min(1),
  location: z.string().min(1).max(100),
  phoneNumber: z.string().min(1).max(20),
  email: z.string().email().max(255),
  organizationType: z.nativeEnum(OrganizationType),
  industryType: z.nativeEnum(IndustryType),
  teamSize: z.nativeEnum(TeamSize),
  yearEstablished: z.string().length(4),
  website: z.string().url().max(255),
  vision: z.string().min(1), // Renamed from "companyVision" to "vision"
  instagramLink: z.string().url().max(50).optional(),
  telegramLink: z.string().url().max(50).optional(),
  facebookLink: z.string().url().max(50).optional(),
  xLink: z.string().url().max(50).optional(),
});

export const GetEmployerProfileSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const CreateEmployerProfileSchema = z.object({
  body: EmployerProfileSchema.omit({ id: true, userId: true }),
});

export const UpdateEmployerProfileSchema = EmployerProfileSchema.partial();
