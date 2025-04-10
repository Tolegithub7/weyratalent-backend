import { Education, Experience, JobLevel, JobRole, JobType, SalaryType, StatusType, Vacancies, DurationValue, DurationUnit } from "@/types";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { EmployerProfileSchema, UpdateEmployerProfileSchema } from "./employerProfile.validator";

extendZodWithOpenApi(z);
export const JobPostingSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  jobTitle: z.string().min(1, "Job title is required").openapi({
    description: "Job Title",
    default: "Frontend Developer",
  }),
  jobRole: z.nativeEnum(JobRole).openapi({
    description: "Job Role",
    default: JobRole.SOFTWARE_ENGINEER,
  }),
  jobType: z.nativeEnum(JobType).openapi({
    description: "Job Type",
    default: JobType.FULL_TIME,
  }),
  jobLevel: z.nativeEnum(JobLevel).openapi({
    description: "Job Level",
    default: JobLevel.ENTRY_LEVEL,
  }),
  salaryType: z.nativeEnum(SalaryType).openapi({
    description: "Salary Type",
    default: SalaryType.HOURLY,
  }),
  vacancies: z.nativeEnum(Vacancies).openapi({
    description: "Vacancies",
    default: Vacancies.Four,
  }),
  description: z.string().min(1, "Description is required").openapi({
    description: "Job Description",
  }),
  responsibilities: z.string().min(1, "Responsibilities are required").openapi({
    description: "Responsibilities and To Dos",
  }),
  minSalary: z.number().min(0, "Minimum salary must be a positive number").openapi({
    description: "Minimum Salary",
  }),
  maxSalary: z.number().min(0, "Maximum salary must be a positive number").openapi({
    description: "Maximum Salary",
  }),
  expiryDate: z.string().datetime({ offset: true }).openapi({
    description: "Job application closing date",
  }),
  // expiryDate: z.preprocess(
  //   (arg) => (typeof arg === "string" ? new Date(arg) : arg),
  //   z.date()
  // ), // convert input string to date
  experience: z.nativeEnum(Experience).openapi({
    description: "Experience level needed",
    default: Experience.MID_LEVEL,
  }),
  education: z.nativeEnum(Education).openapi({
    description: "Education level",
    default: Education.BachelorDegree,
  }),
  status: z.nativeEnum(StatusType).optional().openapi({
    description: "Currrent Status of the Opening",
    default: StatusType.ACTIVE,
  }),
  durationValue: z.nativeEnum(DurationValue).openapi({
    description: "Project duration value (e.g., '6+')",
    default: DurationValue.SIX_PLUS,
  }),
  durationUnit: z.nativeEnum(DurationUnit).openapi({
    description: "Project duration unit (e.g., 'month')",
    default: DurationUnit.MONTH,
  }),
  // createdAt: z.date().optional(),
  // updatedAt: z.date().optional(),
});

export const GetJobPostingSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export const GetAllJobsSchema = JobPostingSchema.extend({
  employerProfile: EmployerProfileSchema.omit({
    banner: true,
    logo: true,
  }).partial(),
});

export const CreateJobPostingSchema = z.object({
  body: JobPostingSchema.omit({ id: true, userId: true, status: true }),
});

export const UpdateJobPostingSchema = JobPostingSchema.partial();

export type JobPostingType = z.infer<typeof JobPostingSchema>;
export type CreateJobPostingType = z.infer<typeof CreateJobPostingSchema.shape.body>;
export type UpdateJobPostingType = z.infer<typeof UpdateJobPostingSchema>;
export type GetAllJobsType = z.infer<typeof GetAllJobsSchema>;
