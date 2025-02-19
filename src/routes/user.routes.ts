import { env } from "@/common/utils/envConfig";
import { validateRequest } from "@/common/utils/httpHandlers";
import { userController } from "@/controllers/user.controller";
import { CreateUserSchema, GetUserSchema, UpdateUserSchema, UserSchema } from "@/validator/user.validator";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

export const userRouter: Router = express.Router();
export const userRegistry = new OpenAPIRegistry();
const BASE_API_PATH = env.BASE_API;

userRegistry.register("User", UserSchema);

userRouter.get("/", userController.getUsers);
userRouter.get("/:id", validateRequest(GetUserSchema), userController.getUser);
userRouter.post("/", validateRequest(CreateUserSchema), userController.createUser);
userRouter.put("/:id", validateRequest(UpdateUserSchema), userController.updateUser);
userRouter.delete("/:id", validateRequest(GetUserSchema), userController.deleteUser);

// Get all users
userRegistry.registerPath({
  method: "get",
  path: `${BASE_API_PATH}/user`,
  tags: ["User"],
  security: [{ bearerAuth: [] }],
  responses: {
    200: {
      description: "Success",
      content: { "application/json": { schema: z.array(UserSchema) } },
    },
  },
});

//post a user
userRegistry.registerPath({
  method: "post",
  path: `${BASE_API_PATH}/user`,
  tags: ["User"],
  request: {
    body: {
      required: true,
      content: {
        "application/json": {
          schema: CreateUserSchema.shape.body,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Created",
      content: {
        "application/json": {
          schema: UserSchema,
        },
      },
    },
  },
});

//Get user by ID
userRegistry.registerPath({
  method: "get",
  path: `${BASE_API_PATH}/user/{id}`,
  tags: ["User"],
  request: { params: GetUserSchema.shape.params },
  responses: {
    200: {
      description: "Success",
      content: {
        "application/json": {
          schema: UserSchema,
        },
      },
    },
  },
});

// PUT update user
userRegistry.registerPath({
  method: "put",
  path: `${BASE_API_PATH}/user/{id}`,
  tags: ["User"],
  request: {
    params: GetUserSchema.shape.params,
    body: {
      required: true,
      content: {
        "application/json": {
          schema: UpdateUserSchema,
        },
      },
    },
  },
  responses: {
    200: {
      description: "Success",
      content: { "application/json": { schema: UserSchema } },
    },
  },
});

// DELETE user
userRegistry.registerPath({
  method: "delete",
  path: `${BASE_API_PATH}/user/{id}`,
  tags: ["User"],
  request: { params: GetUserSchema.shape.params },
  responses: {
    204: { description: "No Content" },
  },
});
