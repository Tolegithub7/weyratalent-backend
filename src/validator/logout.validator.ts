import { z } from "zod";
export const LogoutSchema = z.object({
  body: z.object({
    refreshToken: z.string(),
  }),
});
