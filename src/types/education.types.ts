import type { EducationResponseSchema } from "@/validator/cv.validator";
import type { z } from "zod";
export type EducationResponseType = z.infer<typeof EducationResponseSchema>;
