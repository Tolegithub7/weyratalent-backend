import { JobLevel, JobRole, JobType, SalaryType, Vacancies, Experience, Education, StatusType } from "@/types";
import { z } from "zod";

export const JobPostingSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  jobTitle: z.string().min(1, "Job title is required"),
  jobRole: z.nativeEnum(JobRole),
  jobType: z.nativeEnum(JobType),
  jobLevel: z.nativeEnum(JobLevel),
  salaryType: z.nativeEnum(SalaryType),
  vacancies: z.nativeEnum(Vacancies),
  description: z.string().min(1, "Description is required"),
  responsibilities: z.string().min(1, "Responsibilities are required"),
  minSalary: z.number().min(0, "Minimum salary must be a positive number"),
  maxSalary: z.number().min(0, "Maximum salary must be a positive number"),
  expiryDate: z.string().datetime({ offset: true }),
  // expiryDate: z.preprocess(
  //   (arg) => (typeof arg === "string" ? new Date(arg) : arg),
  //   z.date()
  // ), // convert input string to date
  experience: z.nativeEnum(Experience),
  education: z.nativeEnum(Education),
  status: z.nativeEnum(StatusType).optional(),
  // createdAt: z.date().optional(),
  // updatedAt: z.date().optional(),
});

export const GetJobPostingSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export const CreateJobPostingSchema = z.object({
  body: JobPostingSchema.omit({ id: true, userId: true, status: true }),
});

export const UpdateJobPostingSchema = JobPostingSchema.partial();

export type JobPostingType = z.infer<typeof JobPostingSchema>;
export type CreateJobPostingType = z.infer<typeof CreateJobPostingSchema.shape.body>;
export type UpdateJobPostingType = z.infer<typeof UpdateJobPostingSchema>;