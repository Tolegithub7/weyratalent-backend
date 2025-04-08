import { uploadImages } from "@/common/middleware/uploadMiddleware";
import { env } from "@/common/utils/envConfig";
import { validateRequest } from "@/common/utils/httpHandlers";
import { talentProfileController } from "@/controllers/talentProfile.controller";
import {
  CreateTalentProfileSchema,
  GetTalentProfileSchema,
  TalentProfileSchema,
  UpdateTalentProfileSchema,
} from "@/validator/talentProfile.validator.";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

export const talentProfileRegistry = new OpenAPIRegistry();
export const talentProfileRouter: Router = express.Router();
const BASE_API_PATH = env.BASE_API;

talentProfileRouter.get("/", talentProfileController.getTalentProfiles);
talentProfileRouter.get("/me", talentProfileController.getRegisteredTalentProfile);
talentProfileRouter.get("/:id", validateRequest(GetTalentProfileSchema), talentProfileController.getTalentProfile);
talentProfileRouter.post(
  "/",
  uploadImages.fields([
    {
      name: "profile",
      maxCount: 1,
    },
  ]),
  validateRequest(CreateTalentProfileSchema),
  talentProfileController.createOrUpdateTalentProfile,
);

talentProfileRouter.put(
  "/:id",
  uploadImages.fields([
    {
      name: "profile",
      maxCount: 1,
    },
  ]),
  validateRequest(CreateTalentProfileSchema.partial()),
  talentProfileController.createOrUpdateTalentProfile,
);
talentProfileRouter.delete(
  "/:id",
  validateRequest(GetTalentProfileSchema),
  talentProfileController.deleteTalentProfile,
);

const PaginatedTalentProfileResponse = z.object({
  success: z.boolean(),
  data: z.array(TalentProfileSchema),
  pagination: z.object({
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
  }),
});

talentProfileRegistry.register("talent_profile", TalentProfileSchema);

// GET all talent profiles
talentProfileRegistry.registerPath({
  method: "get",
  path: `${BASE_API_PATH}/talent_profile`,
  security: [],
  tags: ["Talent Profile"],
  request: {
    query: z.object({
      country: z.string().optional().describe("Filter talent profile by country (e.g., 'Algeria')"),
      experience: z.string().optional().describe("Filter talent profile by experience (e.g., 'Entry Level')"),
      minHourlyRate: z.number().optional().describe("Min talent profile filter hourly rate (e.g., 50)"),
      maxHourlyRate: z.number().optional().describe("Max talent profile by hourly rate (e.g., 50)"),
      page: z.number().int().positive().optional().default(1).describe("Page number (default: 1)"),
      limit: z.number().int().positive().optional().default(10).describe("Items per page (default: 10)"),
      // filter i
    }),
  },
  responses: {
    200: {
      description: "Paginated list of talent lists",
      content: {
        "application/json": {
          schema: PaginatedTalentProfileResponse,
          examples: {
            default: {
              value: {
                success: true,
                data: [
                  {
                    id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                    fullName: "John Doe",
                    skills: ["JavaScript", "React"],
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
          },
        },
      },
    },
  },
});

// GET talent profile for registered talent
talentProfileRegistry.registerPath({
  method: "get",
  path: `${BASE_API_PATH}/talent_profile/me`,
  tags: ["Talent Profile"],
  responses: {
    200: {
      description: "Success",
      content: { "application/json": { schema: TalentProfileSchema } },
    },
  },
});

// GET talent profile by id
talentProfileRegistry.registerPath({
  method: "get",
  path: `${BASE_API_PATH}/talent_profile/{id}`,
  request: { params: GetTalentProfileSchema.shape.params },
  tags: ["Talent Profile"],
  responses: {
    200: {
      description: "Success",
      content: {
        "application/json": { schema: TalentProfileSchema },
      },
    },
  },
});

// POST talent profile
talentProfileRegistry.registerPath({
  method: "post",
  path: `${BASE_API_PATH}/talent_profile`,
  tags: ["Talent Profile"],
  request: {
    body: {
      required: true,
      content: {
        "multipart/form-data": {
          schema: CreateTalentProfileSchema.shape.body,
          encoding: {
            file: {
              contentType: "*/*",
            },
          },
        },
      },
    },
  },
  responses: {
    201: {
      description: "Created",
      content: {
        "application/json": { schema: CreateTalentProfileSchema },
      },
    },
  },
});

// DELETE talent profile
talentProfileRegistry.registerPath({
  method: "delete",
  path: `${BASE_API_PATH}/talent_profile/{id}`,
  tags: ["Talent Profile"],
  request: { params: GetTalentProfileSchema.shape.params },
  responses: {
    204: { description: "No Content" },
  },
});

// PUT talent profile
talentProfileRegistry.registerPath({
  method: "put",
  path: `${BASE_API_PATH}/talent_profile/{id}`,
  tags: ["Talent Profile"],
  summary: "Update talent profile by id",
  request: {
    body: {
      required: true,
      content: {
        "multipart/form-data": {
          schema: UpdateTalentProfileSchema,
          encoding: {
            file: {
              contentType: "*/*",
            },
          },
        },
      },
    },
    params: GetTalentProfileSchema.shape.params,
  },
  responses: {
    200: {
      description: "Success",
      content: { "application/json": { schema: TalentProfileSchema } },
    },
  },
});
