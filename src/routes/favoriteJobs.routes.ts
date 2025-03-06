import { env } from "@/common/utils/envConfig";
import { validateRequest } from "@/common/utils/httpHandlers";
import { favoriteJobsController } from "@/controllers/favoriteJobs.controller";
import {
  AddFavoriteJobSchema,
  FavoriteJobsSchema,
  GetFavoriteJobReqSchema,
  RemoveFavoriteJobReqSchema,
} from "@/validator/favoriteJobs.validator";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";

export const favoriteJobsRouter: Router = express.Router();
export const favoriteJobsRegistery = new OpenAPIRegistry();
const BASE_API_PATH = env.BASE_API;

// Routes
favoriteJobsRouter.post("/", validateRequest(AddFavoriteJobSchema), favoriteJobsController.addFavoriteJob);
favoriteJobsRouter.get("/", favoriteJobsController.getFavoriteJobs);
favoriteJobsRouter.get("/me", favoriteJobsController.getFavoriteJobsForRegisteredUser);
favoriteJobsRouter.get("/:id", validateRequest(GetFavoriteJobReqSchema), favoriteJobsController.getFavoriteJob);
favoriteJobsRouter.delete("/", validateRequest(RemoveFavoriteJobReqSchema), favoriteJobsController.removeFavoriteJob);

favoriteJobsRegistery.register("Favorite Jobs", FavoriteJobsSchema);

// GET all favorite jobs
favoriteJobsRegistery.registerPath({
  method: "get",
  path: `${BASE_API_PATH}/favorite_jobs`,
  tags: ["Favorite Jobs"],
  responses: {
    200: {
      description: "Success",
      content: { "applications/json": { schema: z.array(FavoriteJobsSchema) } },
    },
  },
});

// GET favorite jobs for registered Talents
favoriteJobsRegistery.registerPath({
  method: "get",
  path: `${BASE_API_PATH}/favorite_jobs/me`,
  tags: ["Favorite Jobs"],
  responses: {
    200: {
      description: "Success",
      content: { "application/json": { schema: FavoriteJobsSchema } },
    },
  },
});

// GET favorite jobs by ID
favoriteJobsRegistery.registerPath({
  method: "get",
  path: `${BASE_API_PATH}/favorite_jobs/{id}`,
  request: { params: GetFavoriteJobReqSchema.shape.params },
  tags: ["Favorite Jobs"],
  responses: {
    200: {
      description: "Success",
      content: {
        "application/json": { schema: FavoriteJobsSchema },
      },
    },
  },
});

// ADD a favorite Job
favoriteJobsRegistery.registerPath({
  method: "post",
  path: `${BASE_API_PATH}/favorite_jobs`,
  tags: ["Favorite Jobs"],
  request: {
    body: {
      required: true,
      content: {
        "application/json": {
          schema: AddFavoriteJobSchema.shape.body,
        },
      },
    },
  },
  responses: {
    201: {
      description: "Created",
      content: {
        "application/json": { schema: AddFavoriteJobSchema },
      },
    },
  },
});

// REMOVE favorite job
favoriteJobsRegistery.registerPath({
  method: "delete",
  path: `${BASE_API_PATH}/favorite_jobs`,
  tags: ["Favorite Jobs"],
  request: {
    body: {
      required: true,
      content: {
        "application/json": {
          schema: RemoveFavoriteJobReqSchema.shape.body,
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
