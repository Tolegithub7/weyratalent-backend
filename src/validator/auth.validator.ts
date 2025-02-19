import { z } from "zod";

export const LoginInputSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string(),
  }),
});

export const RefreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1),
  }),
});
