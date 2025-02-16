import { env } from "@/common/utils/envConfig";
import { validateRequest } from "@/common/utils/httpHandlers";
import { cvController } from "@/controllers/cv.controller";
import { CVSchema, CreateCVSchema, GetCVListSchema, GetCVReqSchema, UpdateCVSchema } from "@/validator/cv.validator";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { Router } from "express";
import { z } from "zod";

export const cvRouter: Router = Router();
export const cvRegistry = new OpenAPIRegistry();
const BASE_API_PATH = env.BASE_API;

cvRouter.post("/", validateRequest(CreateCVSchema), cvController.create);
cvRouter.get("/", cvController.getAllCvs);
cvRouter.get("/:id", validateRequest(GetCVReqSchema), cvController.getCv);
cvRouter.put("/:id", validateRequest(UpdateCVSchema), cvController.updateCv);
cvRouter.delete("/:id", validateRequest(GetCVReqSchema), cvController.deleteCv);

cvRegistry.register("cv", CVSchema);

cvRegistry.registerPath({
  method: "post",
  path: `${BASE_API_PATH}/cv`,
  tags: ["CV"],
  summary: "Create a new CV with profile information",
  security: [], //atleast for now okay?
  request: {
    body: {
      required: true,
      content: {
        "application/json": {
          schema: CreateCVSchema.shape.body,
        },
      },
    },
  },
  responses: {
    201: {
      description: "success",
      content: { "application/json": { schema: CVSchema } },
    },
  },
});

cvRegistry.registerPath({
  method: "get",
  path: `${BASE_API_PATH}/cv/{id}`,
  tags: ["CV"],
  summary: "get cv with a specific Id",
  request: {
    params: GetCVReqSchema.shape.params,
  },
  responses: {
    200: {
      description: "success",
      content: {
        "application/json": {
          schema: CVSchema,
        },
      },
    },
  },
});

cvRegistry.registerPath({
  method: "get",
  path: `${BASE_API_PATH}/cv`,
  tags: ["CV"],
  summary: "Get all CVs",
  responses: {
    200: {
      description: "Success",
      content: {
        "appliction/json": {
          schema: CVSchema.array(),
        },
      },
    },
  },
});

cvRegistry.registerPath({
  method: "put",
  path: `${BASE_API_PATH}/cv/{id}`,
  tags: ["CV"],
  summary: "Update cv by id",
  request: {
    body: {
      required: true,
      content: {
        "application/json": {
          schema: UpdateCVSchema,
        },
      },
    },
    params: GetCVReqSchema.shape.params,
  },
  responses: {
    200: {
      description: "Success",
      content: {
        "application/json": {
          schema: CVSchema,
        },
      },
    },
  },
});

cvRegistry.registerPath({
  method: "delete",
  path: `${BASE_API_PATH}/cv/{id}`,
  tags: ["CV"],
  summary: "Delete CV by id",
  request: { params: GetCVReqSchema.shape.params },
  responses: {
    204: {
      description: "Success",
    },
  },
});
