import { Country, UserRole } from "@/types";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export const UserSchema = z.object({
  id: z.string().uuid(),
  fullName: z.string().trim().min(1, "Full name is required").max(255).nullable(), // Allow null
  userName: z.string().trim().min(1, "Username is required").max(50).nullable(), // Allow null
  email: z.string().email("Invalid email format"),
  country: z.nativeEnum(Country, {
    required_error: "Country is required",
    invalid_type_error: "Invalid country",
  }),
  password: z.string().min(8, "Password must be at least 8 characters"),
  companyName: z.string().max(100).nullable().optional(), // Allow null
  address: z.string().nullable().optional(), // Allow null
  phoneNumber: z.string().min(10, "Phone number is too short").max(15, "Phone number is too long").nullable(), // Allow null
  verifiedLicense: z.string().nullable().optional(), // Allow null
  agreeTermsService: z.boolean().default(false),
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

export const UserResponseSchema = UserSchema.omit({
  password: true,
});

export const ReqUserSchema = UserSchema.pick({
  id: true,
  email: true,
}).or(UserSchema.pick({ id: true }));
