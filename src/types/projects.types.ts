import type { ProjectResponseSchema } from "@/validator/cv.validator";
import type { z } from "zod";

export type ProjectResponseType = z.infer<typeof ProjectResponseSchema>;
