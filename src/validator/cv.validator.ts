import { Categories } from "@/types";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
extendZodWithOpenApi(z);

export const WorkExperienceSchema = z.object({
  jobTitle: z.string(),
  company: z.string(),
  start_date: z.string(),
  end_date: z.string().optional(),
});

export const EducationSchema = z.object({
  degree: z.string(),
  institution: z.string(),
  start_date: z.string(),
  end_date: z.string().optional(),
  gpa: z.number().optional(),
});

export const ProjectSchema = z.object({
  title: z.string().trim().min(1, "title is required"),
  description: z.string().trim().min(5, "description is required"),
  projectLink: z.string().optional(),
});

export const EducationResponseSchema = EducationSchema.extend({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const ProjectResponseSchema = ProjectSchema.extend({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const WorkExperienceResponseSchema = WorkExperienceSchema.extend({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CVSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  fullName: z.string().min(1, "Name is required"),
  skillTitle: z.string(),
  hourlyRate: z.number().int(),
  primarySkills: z.string().array(),
  workExperience: z.array(WorkExperienceSchema).optional(),
  education: z.array(EducationSchema).optional(),
  project: z.array(ProjectSchema).optional(),
});

export const CVResponseSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  fullName: z.string(),
  skillTitle: z.string(),
  hourlyRate: z.number().int(),
  primarySkills: z.string().array(),
  workExperience: z.array(WorkExperienceResponseSchema).optional(),
  education: z.array(EducationResponseSchema).optional(),
  project: z.array(ProjectResponseSchema).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateCVSchema = z.object({
  body: CVSchema.omit({
    userId: true,
    id: true,
  }),
});

export const GetCVListSchema = z.object({
  userId: z.string().uuid(),
  id: z.string().uuid(),
  skillTitle: z.string(),
  hourlyRate: z.number().int(),
  categories: z.nativeEnum(Categories),
});

export const UpdateCVSchema = z.object({
  body: CreateCVSchema.partial(),
});

// get CV by id
export const GetCVReqSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
});
