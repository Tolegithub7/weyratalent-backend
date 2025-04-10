import type { CVResponseSchema, CreateCVSchema } from "@/validator/cv.validator";
import type { z } from "zod";
import {
  type EducationType,
  type ProjectType,
  WorkExperienceResponseType,
  type WorkExperienceType,
} from "./workExperience.types";

export enum Categories {
  FRONTEND = "frontend",
  BACKEND = "backend",
  GRAPHICS = "graphics design",
  FULLSTACK = "fullstack",
  DEVOPS = "devops",
  GAME = "game",
  ML = "machine learning",
  AI = "AI",
  MOBILE = "mobile",
}

export type CVInputType = z.infer<typeof CreateCVSchema.shape.body>;
export type CVResponseType = z.infer<typeof CVResponseSchema>;
export interface CVUpdateDTO {
  fullName?: string;
  skillTitle?: string;
  hourlyRate?: number;
  primarySkills?: Array<string>;
  workExperience?: Array<WorkExperienceType>;
  education?: Array<EducationType>;
  project?: Array<ProjectType>;
}
