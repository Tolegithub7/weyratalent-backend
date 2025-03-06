import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const FavoriteJobsSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  jobProfileId: z.string().uuid(),
});

export const AddFavoriteJobSchema = z.object({
  body: z.object({
    jobProfileId: z.string().uuid().openapi({
      description: "Job Profile Id",
    }),
  }),
});

export const RemoveFavoriteJobReqSchema = z.object({
  body: z.object({
    jobProfileId: z.string().uuid().openapi({
      description: "Job Profile Id",
    }),
  }),
});

export const GetFavoriteJobReqSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});
