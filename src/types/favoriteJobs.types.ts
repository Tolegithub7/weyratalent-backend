import type { FavoriteJobsSchema } from "@/validator/favoriteJobs.validator";
import type { z } from "zod";

export type FavoriteJobsType = z.infer<typeof FavoriteJobsSchema>;
