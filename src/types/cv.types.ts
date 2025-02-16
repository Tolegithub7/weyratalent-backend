import type { CVResponseSchema, CreateCVSchema } from "@/validator/cv.validator";
import type { z } from "zod";

export enum Categories {
  FRONTEND = "frontend",
  BACKEND = "backend",
  GRAPHICS = "graphics design",
  FULLSTACK = "fullstack",
  DEVOPS = "devops",
  GAME = "game",
  ML = "machine learning",
  AI = "AI",
  MOBILE = "mobile",
}

export type CVInputType = z.infer<typeof CreateCVSchema.shape.body>;
export type CVResponseType = z.infer<typeof CVResponseSchema>;
