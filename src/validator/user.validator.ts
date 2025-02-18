import { UserRole } from "@/types";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const UserSchema = z.object({
  id: z.string().uuid(),
  firstName: z.string().trim().min(1, "First name required").max(255),
  lastName: z.string().trim().min(1, "Last name required").max(255),
  email: z.string().email("invalid email format"),
  phoneNumber: z.string().min(10, "Phone number is too short").max(15, "phone number is too long"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.nativeEnum(UserRole).optional().default(UserRole.TALENT),
});

export const GetUserSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const CreateUserSchema = z.object({
  body: UserSchema.omit({
    id: true,
  }),
});

export const CreateUserInputSchema = UserSchema.omit({
  id: true,
});

export const UpdateUserSchema = UserSchema.partial();
