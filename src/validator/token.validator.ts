import { TokenTypeEnum } from "@/types/token.types.";
import { z } from "zod";

export const TokenSchema = z.object({
  token: z.string(),
  userId: z.string(),
  type: z.nativeEnum(TokenTypeEnum),
  expires: z.date(),
});
