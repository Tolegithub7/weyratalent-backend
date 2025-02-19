import type {
  CreateUserInputSchema,
  ReqUserSchema,
  UpdateUserSchema,
  UserResponseSchema,
  UserSchema,
} from "@/validator/user.validator";
import type { z } from "zod";
import type { AccessAndRefreshTokens } from "./token.types.";
export enum UserRole {
  ADMIN = "admin",
  TALENT = "talent",
  RECRUITER = "recruiter",
}

export enum Experience {
  ENTRY_LEVEL = "Entry Level",
  MID_LEVEL = "Mid Level",
  SENIOR_LEVEL = "Senior Level",
}

export enum Gender {
  MALE = "male",
  FEMALE = "female",
}

export type UserType = z.infer<typeof UserSchema>;
export type UserInputType = z.infer<typeof CreateUserInputSchema>;
export type UpdateUserType = z.infer<typeof UpdateUserSchema>;
export type UserResponseType = z.infer<typeof UserResponseSchema>;

export interface UserWithTokens {
  user: UserResponseType;
  tokens: AccessAndRefreshTokens;
}
export type ReqUserType = z.infer<typeof ReqUserSchema>;
