import { db } from "@/db/database.config";
import { token } from "@/entities";
import type { NewTokenType, TokenType, TokenTypeEnum } from "@/types/token.types.";
import { and, eq } from "drizzle-orm";
import { StatusCodes } from "http-status-codes";

export class TokenDataService {
  async queryToken(tokenData: string, type: TokenTypeEnum): Promise<TokenType[]> {
    const tokens = await db
      .select()
      .from(token)
      .where(and(eq(token.token, tokenData), eq(token.type, type)));

    return tokens as TokenType[];
  }

  async deleteToken(id: string): Promise<boolean> {
    const result = await db.delete(token).where(eq(token.id, id)).returning();

    return result.length !== 0;
  }
}

export const tokenDataService = new TokenDataService();
