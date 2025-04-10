import type {
  AppliedJobsSchema,
  GetApplicationsByJobId,
  NewJobApplicationSchema,
} from "@/validator/appliedJobs.validator";
import type { z } from "zod";
export enum ApplicationStatus {
  PENDING = "pending",
  HIRED = "hired",
  INTERVIEWING = "interviewing",
  REJECTED = "rejected",
  WITHDRAWN = "withdrawn",
}

export type AppliedJobsType = z.infer<typeof AppliedJobsSchema>;
export type NewApplicationType = z.infer<typeof NewJobApplicationSchema>;
export type GetApplicationsByJobIdType = z.infer<typeof GetApplicationsByJobId>;
