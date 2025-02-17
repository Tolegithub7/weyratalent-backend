import type { WorkExperienceResponseSchema } from "@/validator/cv.validator";
import type { z } from "zod";
export type WorkExperienceResponseType = z.infer<typeof WorkExperienceResponseSchema>;
