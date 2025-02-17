<<<<<<< Updated upstream
import { IndustryType, OrganizationType, TeamSize } from "@/types/employerProfile.types";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
=======
import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { OrganizationType, IndustryType, TeamSize } from "@/types/employerProfile.types";
>>>>>>> Stashed changes

extendZodWithOpenApi(z);

export const EmployerProfileSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  logoUrl: z.string().optional(),
  bannerUrl: z.string(),
  companyName: z.string(),
  about: z.string(),
  location: z.string(),
  phoneNumber: z.string(),
  email: z.string().email(),
  organizationType: z.nativeEnum(OrganizationType),
  industryType: z.nativeEnum(IndustryType),
  teamSize: z.nativeEnum(TeamSize),
  yearEstablished: z.string(),
  website: z.string().url(),
  vision: z.string(),
  socialLinks: z.record(z.string().url().or(z.literal(""))).optional(),
  // socialLinks: z
  //   .object({
  //     facebook: z.string().optional(),
  //     instagram: z.string().optional(),
  //     youtube: z.string().optional(),
  //     linkedin: z.string().optional(),
  //     twitter: z.string().optional(),
  //     others: z.record(z.string()).optional(),
  //   })
  //   .optional(),
});

export const GetEmployerProfileSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export const CreateEmployerProfileSchema = z.object({
  body: EmployerProfileSchema.omit({ id: true, userId: true }),
});

export const UpdateEmployerProfileSchema = EmployerProfileSchema.partial();
