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
employerProfileRouter.get(
  "/:id",
  validateRequest(GetEmployerProfileSchema),
  employerProfileController.getEmployerProfile,
);
employerProfileRouter.post(
  "/",
  validateRequest(CreateEmployerProfileSchema),
  employerProfileController.createEmployerProfile,
);
employerProfileRouter.put(
  "/:id",
  validateRequest(UpdateEmployerProfileSchema),
  employerProfileController.updateEmployerProfile,
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
        "application/json": {
          schema: CreateEmployerProfileSchema.shape.body,
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
        "application/json": {
          schema: UpdateEmployerProfileSchema,
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
