import type {
  EducationSchema,
  ProjectSchema,
  WorkExperienceResponseSchema,
  WorkExperienceSchema,
} from "@/validator/cv.validator";
import type { z } from "zod";
export type WorkExperienceResponseType = z.infer<typeof WorkExperienceResponseSchema>;
export type WorkExperienceType = z.infer<typeof WorkExperienceSchema>;
export type ProjectType = z.infer<typeof ProjectSchema>;
export type EducationType = z.infer<typeof EducationSchema>;
