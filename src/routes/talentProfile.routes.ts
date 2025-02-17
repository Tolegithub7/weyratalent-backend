import { env } from "@/common/utils/envConfig";
import { validateRequest } from "@/common/utils/httpHandlers";
import { talentProfileController } from "@/controllers/talentProfile.controller";
import {
  CreateTalentProfileSchema,
  GetTalentProfileSchema,
  TalentProfileSchema,
} from "@/validator/talentProfile.validator.";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

export const talentProfileRegistry = new OpenAPIRegistry();
export const talentProfileRouter: Router = express.Router();
const BASE_API_PATH = env.BASE_API;

talentProfileRouter.get("/", talentProfileController.getTalentProfiles);
talentProfileRouter.get("/:id", validateRequest(GetTalentProfileSchema), talentProfileController.getTalentProfile);
talentProfileRouter.post("/", validateRequest(CreateTalentProfileSchema), talentProfileController.createTalentProfile);
talentProfileRouter.put(
  "/",
  validateRequest(CreateTalentProfileSchema.partial()),
  talentProfileController.updateTalentProfile,
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

// GET talent profile by id
talentProfileRegistry.registerPath({
  method: "get",
  path: `${BASE_API_PATH}/talent_profile/{id}`,
  request: { params: GetTalentProfileSchema.shape.params },
  tags: ["Talent Profile"],
  responses: {
    200: {
      description: "Success",
      content: { "applications/json": { schema: GetTalentProfileSchema.shape.params } },
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
        "application/json": {
          schema: CreateTalentProfileSchema.shape.body,
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
        "application/json": {
          schema: CreateTalentProfileSchema.shape.body.partial(),
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
