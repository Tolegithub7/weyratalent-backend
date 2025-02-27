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
export enum Country {
  ALGERIA = "Algeria",
  ANGOLA = "Angola",
  BENIN = "Benin",
  BOTSWANA = "Botswana",
  BURKINA_FASO = "Burkina Faso",
  BURUNDI = "Burundi",
  CAPE_VERDE = "Cape Verde",
  CAMEROON = "Cameroon",
  CENTRAL_AFRICAN_REPUBLIC = "Central African Republic",
  CHAD = "Chad",
  COMOROS = "Comoros",
  DEMOCRATIC_REPUBLIC_OF_CONGO = "Democratic Republic of the Congo",
  DJIBOUTI = "Djibouti",
  EGYPT = "Egypt",
  EQUATORIAL_GUINEA = "Equatorial Guinea",
  ERITREA = "Eritrea",
  ESWATINI = "Eswatini",
  ETHIOPIA = "Ethiopia",
  GABON = "Gabon",
  GAMBIA = "Gambia",
  GHANA = "Ghana",
  GUINEA = "Guinea",
  GUINEA_BISSAU = "Guinea-Bissau",
  IVORY_COAST = "Ivory Coast",
  KENYA = "Kenya",
  LESOTHO = "Lesotho",
  LIBERIA = "Liberia",
  LIBYA = "Libya",
  MADAGASCAR = "Madagascar",
  MALAWI = "Malawi",
  MALI = "Mali",
  MAURITANIA = "Mauritania",
  MAURITIUS = "Mauritius",
  MOROCCO = "Morocco",
  MOZAMBIQUE = "Mozambique",
  NAMIBIA = "Namibia",
  NIGER = "Niger",
  NIGERIA = "Nigeria",
  RWANDA = "Rwanda",
  SAO_TOME_AND_PRINCIPE = "São Tomé and Príncipe",
  SENEGAL = "Senegal",
  SEYCHELLES = "Seychelles",
  SIERRA_LEONE = "Sierra Leone",
  SOMALIA = "Somalia",
  SOUTH_AFRICA = "South Africa",
  SOUTH_SUDAN = "South Sudan",
  SUDAN = "Sudan",
  TANZANIA = "Tanzania",
  TOGO = "Togo",
  TUNISIA = "Tunisia",
  UGANDA = "Uganda",
  ZAMBIA = "Zambia",
  ZIMBABWE = "Zimbabwe",
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
