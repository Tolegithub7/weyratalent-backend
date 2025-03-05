import { env } from "@/common/utils/envConfig";
import { validateRequest } from "@/common/utils/httpHandlers";
import { jobPostingController } from "@/controllers/jobPosting.controller";
import { CreateJobPostingSchema, GetJobPostingSchema, JobPostingSchema } from "@/validator/jobPosting.validator";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

export const jobPostingRegistry = new OpenAPIRegistry();
export const jobPostingRouter: Router = express.Router();
const BASE_API_PATH = env.BASE_API;

jobPostingRouter.get("/", jobPostingController.getJobPostings);
jobPostingRouter.get("/:id", validateRequest(GetJobPostingSchema), jobPostingController.getJobPosting);
jobPostingRouter.post("/", validateRequest(CreateJobPostingSchema), jobPostingController.createJobPosting);
jobPostingRouter.put("/:id", validateRequest(CreateJobPostingSchema.partial()), jobPostingController.updateJobPosting);
jobPostingRouter.delete("/:id", validateRequest(GetJobPostingSchema), jobPostingController.deleteJobPosting);

jobPostingRegistry.register("job_posting", JobPostingSchema);

// GET all job postings
jobPostingRegistry.registerPath({
  method: "get",
  path: `${BASE_API_PATH}/job_posting`,
  tags: ["Job Posting"],
  responses: {
    200: {
      description: "Success",
      content: { "application/json": { schema: z.array(JobPostingSchema) } },
    },
  },
});

// GET job posting by id
jobPostingRegistry.registerPath({
  method: "get",
  path: `${BASE_API_PATH}/job_posting/{id}`,
  request: { params: GetJobPostingSchema.shape.params },
  tags: ["Job Posting"],
  responses: {
    200: {
      description: "Success",
      content: { "application/json": { schema: JobPostingSchema } },
    },
  },
});

// POST job posting
jobPostingRegistry.registerPath({
  method: "post",
  path: `${BASE_API_PATH}/job_posting`,
  tags: ["Job Posting"],
  request: {
    body: {
      required: true,
      content: {
        "application/json": {
          schema: CreateJobPostingSchema.shape.body,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Created",
      content: {
        "application/json": { schema: JobPostingSchema },
      },
    },
  },
});

// DELETE job posting
jobPostingRegistry.registerPath({
  method: "delete",
  path: `${BASE_API_PATH}/job_posting/{id}`,
  tags: ["Job Posting"],
  request: { params: GetJobPostingSchema.shape.params },
  responses: {
    204: { description: "No Content" },
  },
});

// PUT job posting
jobPostingRegistry.registerPath({
  method: "put",
  path: `${BASE_API_PATH}/job_posting/{id}`,
  tags: ["Job Posting"],
  summary: "Update job posting by id",
  request: {
    body: {
      required: true,
      content: {
        "application/json": {
          schema: CreateJobPostingSchema.shape.body.partial(),
        },
      },
    },
    params: GetJobPostingSchema.shape.params,
  },
  responses: {
    200: {
      description: "Success",
      content: { "application/json": { schema: JobPostingSchema } },
    },
  },
});
