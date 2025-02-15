import { env } from "@/common/utils/envConfig";
import { validateRequest } from "@/common/utils/httpHandlers";
import { employerProfileController } from "@/controllers/employerProfile.controller";
import {
  CreateEmployerProfileSchema,
  GetEmployerProfileSchema,
  EmployerProfileSchema,
  UpdateEmployerProfileSchema,
} from "@/validator/employerProfile.validator";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { Router } from "express";
import { z } from "zod";

export const employerProfileRegistry = new OpenAPIRegistry();
const router: Router = express.Router();
const BASE_API_PATH = env.BASE_API;

router.post("/", validateRequest(CreateEmployerProfileSchema), employerProfileController.createEmployerProfile);
router.get("/", employerProfileController.getEmployerProfiles);
router.get("/:id", validateRequest(GetEmployerProfileSchema), employerProfileController.getEmployerProfile);
router.put("/:id", validateRequest(UpdateEmployerProfileSchema), employerProfileController.updateEmployerProfile);
router.delete("/:id", validateRequest(GetEmployerProfileSchema), employerProfileController.deleteEmployerProfile);

// Swagger Documentation (mimic talent_profile structure)
employerProfileRegistry.register("employer_profile", EmployerProfileSchema);
employerProfileRegistry.registerPath({
  method: "post",
  path: `${BASE_API_PATH}/employer_profile`,
  tags: ["Employer Profile"],
  request: { body: { content: { "application/json": { schema: CreateEmployerProfileSchema } } } },
  responses: { 201: { description: "Created", content: { "application/json": { schema: EmployerProfileSchema } } } },
});

export default router;