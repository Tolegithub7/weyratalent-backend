import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);
export const CreateOTPSchema = z.object({
  email: z.string().openapi({
    description: "email that requested the otp",
    default: "weyra-test@gmail.com",
  }),
  otp: z.string().openapi({
    description: "generated OTP",
  }),
});

export const GenerateOTPReqSchema = z.object({
  body: z.object({
    email: z.string(),
  }),
});
