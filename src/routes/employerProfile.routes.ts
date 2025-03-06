import { uploadImages } from "@/common/middleware/uploadMiddleware";
import { env } from "@/common/utils/envConfig";
import { validateRequest } from "@/common/utils/httpHandlers";
import { employerProfileController } from "@/controllers/employerProfile.controller";
import {
  CreateEmployerProfileSchema,
  EmployerProfileSchema,
  GetEmployerProfileSchema,
  UpdateEmployerProfileSchema,
} from "@/validator/employerProfile.validator";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

export const employerProfileRegistry = new OpenAPIRegistry();
export const employerProfileRouter: Router = express.Router();
const BASE_API_PATH = env.BASE_API;

// Routes
employerProfileRouter.get("/", employerProfileController.getEmployerProfiles);
employerProfileRouter.get("/me", employerProfileController.getRegisteredEmployerProfile);
employerProfileRouter.get(
  "/:id",
  validateRequest(GetEmployerProfileSchema),
  employerProfileController.getEmployerProfile,
);
employerProfileRouter.post(
  "/",
  uploadImages.fields([
    { name: "banner", maxCount: 1 },
    { name: "logo", maxCount: 1 },
  ]),
  validateRequest(CreateEmployerProfileSchema),
  employerProfileController.createOrUpdateEmployerProfile,
);
employerProfileRouter.put(
  "/:id",
  uploadImages.fields([
    { name: "banner", maxCount: 1 },
    { name: "logo", maxCount: 1 },
  ]),
  validateRequest(UpdateEmployerProfileSchema),
  employerProfileController.createOrUpdateEmployerProfile,
);
employerProfileRouter.delete(
  "/:id",
  validateRequest(GetEmployerProfileSchema),
  employerProfileController.deleteEmployerProfile,
);

// OpenAPI Documentation
employerProfileRegistry.register("employer_profile", EmployerProfileSchema);

// GET all employer profiles
employerProfileRegistry.registerPath({
  method: "get",
  path: `${BASE_API_PATH}/employer_profile`,
  tags: ["Employer Profile"],
  responses: {
    200: {
      description: "Success",
      content: { "application/json": { schema: z.array(EmployerProfileSchema) } },
    },
  },
});

// GET employer profile for registered employer
employerProfileRegistry.registerPath({
  method: "get",
  path: `${BASE_API_PATH}/employer_profile/me`,
  tags: ["Employer Profile"],
  responses: {
    200: {
      description: "Success",
      content: { "application/json": { schema: EmployerProfileSchema } },
    },
  },
});

// GET employer profile by ID
employerProfileRegistry.registerPath({
  method: "get",
  path: `${BASE_API_PATH}/employer_profile/{id}`,
  request: { params: GetEmployerProfileSchema.shape.params },
  tags: ["Employer Profile"],
  responses: {
    200: {
      description: "Success",
      content: { "application/json": { schema: EmployerProfileSchema } },
    },
  },
});

// POST employer profile
employerProfileRegistry.registerPath({
  method: "post",
  path: `${BASE_API_PATH}/employer_profile`,
  tags: ["Employer Profile"],
  request: {
    body: {
      required: true,
      content: {
        "multipart/form-data": {
          schema: CreateEmployerProfileSchema.shape.body,
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
      content: { "application/json": { schema: EmployerProfileSchema } },
    },
  },
});

// PUT employer profile
employerProfileRegistry.registerPath({
  method: "put",
  path: `${BASE_API_PATH}/employer_profile/{id}`,
  tags: ["Employer Profile"],
  request: {
    body: {
      required: true,
      content: {
        "multipart/form-data": {
          schema: UpdateEmployerProfileSchema,
          encoding: {
            file: {
              contentType: "*/*",
            },
          },
        },
      },
    },
    params: GetEmployerProfileSchema.shape.params,
  },
  responses: {
    200: {
      description: "Success",
      content: { "application/json": { schema: EmployerProfileSchema } },
    },
  },
});

// DELETE employer profile
employerProfileRegistry.registerPath({
  method: "delete",
  path: `${BASE_API_PATH}/employer_profile/{id}`,
  tags: ["Employer Profile"],
  request: { params: GetEmployerProfileSchema.shape.params },
  responses: {
    204: { description: "No Content" },
  },
});
