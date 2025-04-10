// Id, userId, coverLetter, jobProfileId, applicationStatus
import { ApplicationStatus } from "@/types";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { CVSchema } from "./cv.validator";
import { TalentProfileSchema } from "./talentProfile.validator.";

extendZodWithOpenApi(z);

export const AppliedJobsSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  jobProfileId: z.string().uuid().openapi({
    description: "Job Profile Id",
  }),
  coverLetter: z.string().min(10, "A cover letter should atleast be a sentence").openapi({
    description: "Cover Letter",
    default: "Your cover letter here",
  }),
});

export const NewJobApplicationSchema = z.object({
  body: z.object({
    jobProfileId: z.string().uuid().openapi({
      description: "Job Profile Id",
    }),
    coverLetter: z.string().min(10, "A cover letter should atleast be a sentence").openapi({
      description: "Cover Letter",
      default: "Your cover letter here",
    }),
  }),
});

export const GetJobApplicationReqSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const GetApplicationsByJobId = z.object({
  jobApplication: AppliedJobsSchema,
  talentCv: CVSchema,
  talentProfile: TalentProfileSchema,
});
