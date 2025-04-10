import { Categories } from "@/types";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

// Certificate Schema
export const CertificateSchema = z.custom<Express.Multer.File>().openapi({
  type: "string",
  format: "binary",
  description: "Certificate file (supports images: JPEG, PNG, GIF and documents: PDF, DOC, DOCX)",
});

// export const CertificateSchema = z.object({
//   file: z.custom<Express.Multer.File>().optional().openapi({
//     type: "string",
//     format: "binary",
//     description: "Certificate file (image or PDF)",
//   }),
//   url: z.string().url().optional().openapi({
//     description: "URL to the certificate stored in MinIO",
//     example: "http://minio:9000/certificates/3bcef123-45ab-678c-9def-0123456789ab.pdf",
//   }),
// });

// Work Experience Schema
export const WorkExperienceSchema = z.object({
  jobTitle: z.string().openapi({
    description: "Job title of the work experience",
    example: "Software Engineer",
  }),
  company: z.string().openapi({
    description: "Company name",
    example: "Tech Corp",
  }),
  start_date: z.string().openapi({
    description: "Start date of the job",
    example: "2020-01-01",
  }),
  end_date: z.string().optional().openapi({
    description: "End date of the job (if applicable)",
    example: "2023-12-31",
  }),
});

// Education Schema
export const EducationSchema = z.object({
  degree: z.string().openapi({
    description: "Degree obtained",
    example: "Bachelor of Science",
  }),
  institution: z.string().openapi({
    description: "Name of the institution",
    example: "University of Technology",
  }),
  start_date: z.string().openapi({
    description: "Start date of the education",
    example: "2016-09-01",
  }),
  end_date: z.string().optional().openapi({
    description: "End date of the education (if applicable)",
    example: "2020-06-30",
  }),
  gpa: z.number().optional().openapi({
    description: "GPA achieved (if applicable)",
    example: 3.8,
  }),
});

// Project Schema
export const ProjectSchema = z.object({
  title: z.string().trim().min(1, "Title is required").openapi({
    description: "Title of the project",
    example: "E-commerce Platform",
  }),
  description: z.string().trim().min(5, "Description is required").openapi({
    description: "Description of the project",
    example: "Developed a full-stack e-commerce platform.",
  }),
  projectLink: z.string().optional().openapi({
    description: "Link to the project (if available)",
    example: "https://github.com/user/ecommerce-platform",
  }),
});

// Response Schemas
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

// CV Schema
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

// Create CV Schema
export const CreateCVSchema = z.object({
  body: CVSchema.omit({
    userId: true,
    id: true,
  }),
});

// Get CV List Schema
export const GetCVListSchema = z.object({
  userId: z.string().uuid().openapi({
    description: "User ID associated with the CV",
  }),
  id: z.string().uuid().openapi({
    description: "Unique identifier for the CV",
  }),
  skillTitle: z.string().openapi({
    description: "Skill title or profession",
    example: "Full-Stack Developer",
  }),
  hourlyRate: z.number().int().openapi({
    description: "Hourly rate for the candidate",
    example: 50,
  }),
  categories: z.nativeEnum(Categories).openapi({
    description: "Category of the CV",
  }),
});

// Update CV Schema
export const UpdateCVSchema = z.object({
  body: CreateCVSchema.partial(),
});

// Get CV by ID Schema
export const GetCVReqSchema = z.object({
  params: z.object({
    id: z.string().uuid().openapi({
      description: "Unique identifier for the CV",
    }),
  }),
});
