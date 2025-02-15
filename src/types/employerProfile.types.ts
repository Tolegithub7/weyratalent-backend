export enum OrganizationType {
  PRIVATE = "Private",
  GOVERNMENT = "Government",
  NONPROFIT = "Nonprofit",
  COOPERATIVE = "Cooperative",
  INTERNATIONAL = "International",
  OTHER = "other",
}

export enum IndustryType {
  TECHNOLOGY = "Technology",
  HEALTHCARE = "Healthcare",
  FINANCE = "Finance",
  EDUCATION = "Education",
  MANUFACTURING = "Manufacturing",
  RETAIL = "Retail",
  TRANSPORTATION = "Transportation",
  ENERGY = "Energy",
  TELECOMMUNICATIONS = "Telecommunications",
  CONSTRUCTION = "Construction",
  AGRICULTURE = "Agriculture",
  ENTERTAINMENT = "Entertainment",
  REAL_ESTATE = "Real Estate",
  HOSPITALITY = "Hospitality",
  GOVERNMENT = "Government",
  OTHER = "other",
}

export enum TeamSize {
  ONE_TO_TEN = "0-10",
  TEN_TO_FIFTY = "10-50",
  FIFTY_PLUS = "50+",
}


import type { z } from "zod";
import type {
  CreateEmployerProfileSchema,
  EmployerProfileSchema,
  UpdateEmployerProfileSchema,
} from "@/validator/employerProfile.validator"; // Ensure this path is correct

export type EmployerProfileType = z.infer<typeof EmployerProfileSchema>;
export type CreateEmployerProfileType = z.infer<typeof CreateEmployerProfileSchema.shape.body>;
export type UpdateEmployerProfileType = z.infer<typeof UpdateEmployerProfileSchema>;
