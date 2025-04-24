import { env } from "@/common/utils/envConfig";
import { validateRequest } from "@/common/utils/httpHandlers";
import { otpController } from "@/controllers/otp.controller";
import { CreateOTPSchema, GenerateOTPReqSchema } from "@/validator/otp.validator";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";

export const otpRegistry = new OpenAPIRegistry();
export const otpRouter: Router = express.Router();
const BASE_API_PATH = env.BASE_API;

otpRouter.post("/", validateRequest(GenerateOTPReqSchema), otpController.generateOtp);

otpRegistry.register("otp", CreateOTPSchema);
otpRegistry.registerPath({
  method: "post",
  path: `${BASE_API_PATH}/generate-otp`,
  security: [],
  tags: ["OTP"],
  request: {
    body: {
      required: true,
      content: {
        "application/json": {
          schema: GenerateOTPReqSchema.shape.body,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Created",
    },
  },
});
