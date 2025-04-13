import { env } from "@/common/utils/envConfig";
import { validateRequest } from "@/common/utils/httpHandlers";
import { appliedJobsController } from "@/controllers/appliedJobs.controller";
import {
  AppliedJobsSchema,
  GetApplicationsByJobId,
  GetJobApplicationReqSchema,
  NewJobApplicationSchema,
  GetApplicationsByUserIdSchema
} from "@/validator/appliedJobs.validator";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

export const appliedJobsRouter: Router = express.Router();
export const appliedJobsRegistry = new OpenAPIRegistry();
const BASE_API_PATH = env.BASE_API;

// Routes
appliedJobsRouter.post("/", validateRequest(NewJobApplicationSchema), appliedJobsController.newApplication);
appliedJobsRouter.get("/", appliedJobsController.getJobApplications);
appliedJobsRouter.get("/me", appliedJobsController.getApplicationForRegisteredTalent);
appliedJobsRouter.get("/jobs/:id", appliedJobsController.getApplicationsByJobId);
appliedJobsRouter.get("/:id", validateRequest(GetJobApplicationReqSchema), appliedJobsController.getApplication);
appliedJobsRouter.get("/users/:userId", validateRequest(GetApplicationsByUserIdSchema), appliedJobsController.getApplicationsByUserId);

appliedJobsRegistry.register("Applied Jobs", AppliedJobsSchema);

// GET all applications
appliedJobsRegistry.registerPath({
  method: "get",
  path: `${BASE_API_PATH}/applied_jobs`,
  tags: ["Applied Jobs"],
  responses: {
    200: {
      description: "Success",
      content: { "applications/json": { schema: z.array(AppliedJobsSchema) } },
    },
  },
});

// GET applied jobs for registered talents
appliedJobsRegistry.registerPath({
  method: "get",
  path: `${BASE_API_PATH}/applied_jobs/me`,
  tags: ["Applied Jobs"],
  responses: {
    200: {
      description: "Success",
      content: { "application/json": { schema: AppliedJobsSchema } },
    },
  },
});

// GET applied jobs by ID
appliedJobsRegistry.registerPath({
  method: "get",
  path: `${BASE_API_PATH}/applied_jobs/{id}`,
  request: { params: GetJobApplicationReqSchema.shape.params },
  tags: ["Applied Jobs"],
  responses: {
    200: {
      description: "Success",
      content: {
        "application/json": { schema: AppliedJobsSchema },
      },
    },
  },
});

//get application by job Id
appliedJobsRegistry.registerPath({
  method: "get",
  path: `${BASE_API_PATH}/applied_jobs/jobs/{id}`,
  request: { params: GetJobApplicationReqSchema.shape.params },
  tags: ["Applied Jobs"],
  responses: {
    200: {
      description: "Success",
      content: { "applications/json": { schema: z.array(GetApplicationsByJobId) } },
    },
  },
});

// Post a job application
appliedJobsRegistry.registerPath({
  method: "post",
  path: `${BASE_API_PATH}/applied_jobs`,
  tags: ["Applied Jobs"],
  request: {
    body: {
      required: true,
      content: {
        "application/json": {
          schema: NewJobApplicationSchema.shape.body,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Created",
      content: {
        "application/json": { schema: AppliedJobsSchema },
      },
    },
  },
});

appliedJobsRegistry.registerPath({
  method: "get",
  path: `${BASE_API_PATH}/applied_jobs/users/{userId}`,
  request: { params: GetApplicationsByUserIdSchema.shape.params },
  tags: ["Applied Jobs"],
  responses: {
    200: {
      description: "Success",
      content: {
        "application/json": { 
          schema: z.array(AppliedJobsSchema) 
        }
      }
    }
  }
});
