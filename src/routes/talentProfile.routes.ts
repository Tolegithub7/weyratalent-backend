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

talentProfileRegistry.register("talent_profile", TalentProfileSchema);

// GET all talent profiles
talentProfileRegistry.registerPath({
  method: "get",
  path: `${BASE_API_PATH}/talent_profile`,
  tags: ["Talent Profile"],
  responses: {
    200: {
      description: "Success",
      content: { "application/json": { schema: z.array(TalentProfileSchema) } },
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
    201: {
      description: "Created",
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
