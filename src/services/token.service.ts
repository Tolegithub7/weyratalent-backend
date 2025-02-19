import { env } from "@/common/utils/envConfig";
import { db } from "@/db/database.config";
import { token } from "@/entities/token.schema";
import type { UserType } from "@/types";
import type { AccessAndRefreshTokens } from "@/types/token.types.";
import {
  type NewPayloadType,
  type NewTokenType,
  type PayloadType,
  TokenPayloadType,
  type TokenType,
  TokenTypeEnum,
} from "@/types/token.types.";
import Jwt, { JsonWebTokenError, type JwtPayload } from "jsonwebtoken";
import moment from "moment";

export class TokenService {
  async saveToken(tokenData: NewTokenType): Promise<TokenType> {
    const createdToken = await db.insert(token).values(tokenData).returning();
    if (!createdToken) {
      throw new Error("Token not saved");
    }

    const savedToken = createdToken[0];
    const returnedToken: TokenType = {
      token: savedToken.token,
      userId: savedToken.userId,
      type: savedToken.type as TokenTypeEnum,
      expires: savedToken.expires,
    };

    return returnedToken;
  }

  generateToken(payload: NewPayloadType, secret: string = env.JWT_SECRET): string {
    const tokenPayload: PayloadType = {
      ...payload,
      exp: moment(payload.exp).unix(),
      iat: moment().unix(),
    };
    return Jwt.sign(tokenPayload, secret);
  }

  async generateAccessAndRefreshToken(user: UserType): Promise<AccessAndRefreshTokens> {
    const accessPayload: NewPayloadType = {
      sub: user.id,
      roles: user.role,
      type: TokenTypeEnum.ACCESS,
      exp: moment().add(env.JWT_ACCESS_EXPIRATION_MINUTES, "minutes"),
    };
    const refreshPayload: NewPayloadType = {
      sub: user.id,
      roles: user.role,
      type: TokenTypeEnum.REFRESH,
      exp: moment().add(env.JWT_REFRESH_EXPIRATION_DAYS, "days"),
    };
    const accessToken = this.generateToken(accessPayload);
    const refreshToken = this.generateToken(refreshPayload);
    await this.saveToken({
      type: TokenTypeEnum.REFRESH,
      userId: user.id,
      token: refreshToken,
      expires: refreshPayload.exp.toDate(),
    });
    return {
      accessToken: {
        token: accessToken,
        expires: accessPayload.exp,
      },
      refreshToken: {
        token: refreshToken,
        expires: refreshPayload.exp,
      },
    };
  }
}

export const tokenService = new TokenService();
