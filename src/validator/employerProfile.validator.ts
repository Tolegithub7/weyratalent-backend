import { IndustryType, OrganizationType, TeamSize } from "@/types/employerProfile.types";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const EmployerProfileSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  banner: z.custom<Express.Multer.File>().openapi({
    type: "string",
    format: "binary",
  }),
  logo: z.custom<Express.Multer.File>().openapi({
    type: "string",
    format: "binary",
  }),
  logoUrl: z.string().url().optional(),
  bannerUrl: z.string().url(),
  companyName: z.string().min(1).max(100).openapi({
    description: "Name of the Company",
  }),
  about: z.string().min(1).openapi({
    description: "Bio for the Company",
  }),
  location: z.string().min(1).max(100).openapi({
    description: "Company Location",
    default: "Ethiopia",
  }),
  phoneNumber: z.string().min(1).max(20).openapi({
    description: "Company Phone Number",
    default: "+1234567890",
  }),
  email: z.string().email().max(255).openapi({
    description: "Email address",
    default: "your-email@gmail.com",
  }),
  organizationType: z.nativeEnum(OrganizationType).openapi({
    description: "Organization Type",
    default: OrganizationType.GOVERNMENT,
  }),
  industryType: z.nativeEnum(IndustryType).openapi({
    description: "Industry type",
    default: IndustryType.EDUCATION,
  }),
  teamSize: z.nativeEnum(TeamSize).openapi({
    description: "Operational Team Size",
    default: TeamSize.ONE_TO_TEN,
  }),
  yearEstablished: z.string().length(4).openapi({
    description: "Year of Establishment",
    default: "2025",
  }),
  website: z.string().url().max(255).openapi({
    description: "Web address",
  }),
  vision: z.string().min(1).openapi({
    description: "Company Vision",
  }),
  instagramLink: z.string().url().max(50).optional().openapi({
    description: "Instagram Link",
  }),
  telegramLink: z.string().url().max(50).optional().openapi({
    description: "Telegram Link",
  }),
  facebookLink: z.string().url().max(50).optional().openapi({
    description: "Facebook Link",
  }),
  xLink: z.string().url().max(50).optional().openapi({
    description: "X link",
  }),
});

export const GetEmployerProfileSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const CreateEmployerProfileSchema = z.object({
  body: EmployerProfileSchema.omit({
    id: true, 
    userId: true, 
    logoUrl: true, 
    bannerUrl: true
  }),
});

export const UpdateEmployerProfileSchema = EmployerProfileSchema.omit({
  userId: true,
  id: true,
  logoUrl: true,
  bannerUrl: true,
}).partial();
