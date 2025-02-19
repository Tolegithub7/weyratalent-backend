import { env } from "@/common/utils/envConfig";
import { validateRequest } from "@/common/utils/httpHandlers";
import { authController } from "@/controllers/auth.controller";
import { LoginInputSchema, RefreshTokenSchema } from "@/validator/auth.validator";
import { CreateUserSchema, UserSchema } from "@/validator/user.validator";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { Router } from "express";
import { z } from "zod";

export const authRouter: Router = Router();
export const authRegistry = new OpenAPIRegistry();
const BASE_API_PATH = env.BASE_API;

authRouter.post("/login", validateRequest(LoginInputSchema), authController.login);
// authRouter.post("/refresh-token", validateRequest(LoginInputSchema), authController.refreshToken);

// AUTH API DOCS
// authRegistry.registerPath({
//   method: "post",
//   path: `${BASE_API_PATH}/auth/refresh-token`,
//   tags: ["Auth"],
//   security: [],
//   request: {
//     body: {
//       required: true,
//       content: {
//         "application/json": {
//           schema: RefreshTokenSchema.shape.body,
//           example: {
//             refreshToken: "refreshToken",
//           },
//         },
//       },
//     },
//   },
//   responses: {
//     201: {
//       description: "Created",
//       content: { "application/json": { schema: z.object({}) } },
//     },
//   },
// });

// AUTH API DOCS
authRegistry.registerPath({
  method: "post",
  path: `${BASE_API_PATH}/auth/login`,
  tags: ["Auth"],
  security: [],
  request: {
    body: {
      required: true,
      content: {
        "application/json": {
          schema: LoginInputSchema.shape.body,
          example: {
            email: "mereb-test@gmail.com",
            password: "password",
          },
        },
      },
    },
  },
  responses: {
    201: {
      description: "Created",
      content: { "application/json": { schema: z.object({}) } },
    },
  },
});
