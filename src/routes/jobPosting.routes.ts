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
jobPostingRouter.get("/me", jobPostingController.getRegisteredJob);
jobPostingRouter.get("/:id", validateRequest(GetJobPostingSchema), jobPostingController.getJobPosting);
jobPostingRouter.post("/", validateRequest(CreateJobPostingSchema), jobPostingController.createJobPosting);
jobPostingRouter.put("/:id", validateRequest(CreateJobPostingSchema.partial()), jobPostingController.updateJobPosting);
jobPostingRouter.delete("/:id", validateRequest(GetJobPostingSchema), jobPostingController.deleteJobPosting);

jobPostingRegistry.register("job_posting", JobPostingSchema);

const PaginatedJobPostingResponse = z.object({
  success: z.boolean(),
  data: z.array(JobPostingSchema),
  pagination: z.object({
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
  }),
});
jobPostingRegistry.registerPath({
  method: "get",
  path: `${BASE_API_PATH}/job_posting`,
  security: [],
  tags: ["Job Posting"],
  summary: "Get job postings with filters and pagination",
  request: {
    query: z.object({
      jobRole: z.string().optional().describe("Filter by job role (e.g., 'Software Engineer')"),
      jobType: z.string().optional().describe("Filter by job type (e.g., 'Full-Time')"),
      jobLevel: z.string().optional().describe("Filter by job level (e.g., 'Entry Level')"),
      salaryType: z.string().optional().describe("Filter by salary type (e.g., 'Hourly')"),
      location: z.string().optional().describe("Filter jobs by location"),
      page: z.number().int().positive().optional().default(1).describe("Page number (default: 1)"),
      limit: z.number().int().positive().optional().default(10).describe("Items per page (default: 10)"),
    }),
  },
  responses: {
    200: {
      description: "Paginated list of job postings",
      content: {
        "application/json": {
          schema: PaginatedJobPostingResponse,
          examples: {
            // Example 1: No filters
            default: {
              value: {
                success: true,
                data: [
                  {
                    id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                    jobTitle: "Frontend Developer",
                    jobRole: "Software Engineer",
                    jobType: "Full-Time",
                    // ... other fields
                  },
                ],
                pagination: {
                  total: 50,
                  page: 1,
                  limit: 10,
                  totalPages: 5,
                },
              },
            },
            // Example 2: With filters
            filtered: {
              value: {
                success: true,
                data: [
                  {
                    id: "4ga85f64-5717-4562-b3fc-2c963f66afa7",
                    jobTitle: "Backend Developer",
                    jobRole: "Software Engineer",
                    jobType: "Full-Time",
                    jobLevel: "Mid Level",
                    // ... other fields
                  },
                ],
                pagination: {
                  total: 15,
                  page: 2,
                  limit: 5,
                  totalPages: 3,
                },
              },
            },
          },
        },
      },
    },
  },
});
// // // GET all job postings
// jobPostingRegistry.registerPath({
//   method: "get",
//   path: `${BASE_API_PATH}/job_posting`,
//   tags: ["Job Posting"],
//   request: {
//     query: z.object({
//       jobRole: z.string().optional(),
//       jobType: z.string().optional(),
//       jobLevel: z.string().optional(),
//       page: z.number().int().positive().optional().default(1),
//       limit: z.number().int().positive().optional().default(10),
//     }),
//   },
//   responses: {
//     200: {
//       description: "Success",
//       content: {
//         "application/json": {
//           schema: z.object({
//             success: z.boolean(),
//             data: z.array(JobPostingSchema),
//             pagination: z.object({
//               total: z.number(),
//               page: z.number(),
//               limit: z.number(),
//               totalPages: z.number(),
//             }),
//           }),
//         },
//       },
//     },
//   },
// });
// // jobPostingRegistry.registerPath({
// //   method: "get",
// //   path: `${BASE_API_PATH}/job_posting`,
// //   tags: ["Job Posting"],
// //   responses: {
// //     200: {
// //       description: "Success",
// //       content: { "application/json": { schema: z.array(JobPostingSchema) } },
// //     },
// //   },
// // });

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

// GET job posting for registered employer
jobPostingRegistry.registerPath({
  method: "get",
  path: `${BASE_API_PATH}/job_posting/me`,
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
        "multipart/form-data": {
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
