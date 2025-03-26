import { env } from "@/common/utils/envConfig";
import { validateRequest } from "@/common/utils/httpHandlers";
import { logoutController } from "@/controllers/logout.controller";
import { LogoutSchema } from "@/validator/logout.validator";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";

export const logoutRegistry = new OpenAPIRegistry();
export const logoutRouter: Router = express.Router();
const BASE_API_PATH = env.BASE_API;

logoutRouter.post("/", validateRequest(LogoutSchema), logoutController.logout);

logoutRegistry.registerPath({
  method: "post",
  path: `${BASE_API_PATH}/logout`,
  tags: ["Logout"],
  request: {
    body: {
      required: true,
      content: {
        "application/json": {
          schema: LogoutSchema.shape.body,
        },
      },
    },
  },
  responses: {
    204: {
      description: "No Content",
    },
  },
});
