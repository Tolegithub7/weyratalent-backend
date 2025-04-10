import { ApiError } from "@/common/models/serviceResponse";
import { env } from "@/common/utils/envConfig";
import { db } from "@/db/database.config";
import { token } from "@/entities/token.schema";
import type { UserType } from "@/types";
import type { AccessAndRefreshTokens, TokenQueryType } from "@/types/token.types.";
import {
  type NewPayloadType,
  type NewTokenType,
  type PayloadType,
  TokenPayloadType,
  type TokenType,
  TokenTypeEnum,
} from "@/types/token.types.";
import { and, eq } from "drizzle-orm";
import type { Request } from "express";
import { StatusCodes } from "http-status-codes";
import Jwt, { JsonWebTokenError, type JwtPayload } from "jsonwebtoken";
import moment from "moment";
import { tokenDataService } from "./token/token.dao";
import { userService } from "./user.service";

export class TokenService {
  async saveToken(tokenData: NewTokenType): Promise<TokenType> {
    const createdToken = await db.insert(token).values(tokenData).returning();
    if (!createdToken) {
      throw new Error("Token not saved");
    }

    const savedToken = createdToken[0];
    const returnedToken: TokenType = {
      id: savedToken.id,
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

  /* refresh token */
  async refreshToken(refreshToken: string, req?: Request): Promise<AccessAndRefreshTokens> {
    const token = await this.verifyToken(refreshToken, TokenTypeEnum.REFRESH, req);
    if (token instanceof Error) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid Token");
    }
    const user = await userService.getUserById(token.userId);
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
    }
    await this.deleteTokens(refreshToken, TokenTypeEnum.REFRESH, user.responseObject?.id as string);
    return this.generateAccessAndRefreshToken(user.responseObject as UserType);
  }

  async deleteTokens(tokenData: string, type: TokenTypeEnum, userId: string) {
    const tokens = await db
      .delete(token)
      .where(and(eq(token.token, tokenData), eq(token.type, type), eq(token.userId, userId)));
  }

  /* find token  */
  async getToken(filter: TokenQueryType): Promise<TokenType> {
    const tokenDoc = await tokenDataService.queryToken(
      filter.token as unknown as string,
      filter.type as unknown as TokenTypeEnum,
    );
    if (!tokenDoc.length) {
      throw new Error("Token not found");
    }
    return tokenDoc[0];
  }

  /* delete token  */
  async deleteToken(filter: TokenQueryType): Promise<boolean> {
    const token = await tokenDataService.queryToken(filter.token as string, filter.type as TokenTypeEnum);
    if (!token.length) {
      throw new Error("Token not found");
    }
    if (token.length > 1) {
      const tokenToDelete = token.filter((t) => t.token === filter.token);
      if (tokenToDelete.length > 1) {
        throw new Error("Multiple tokens found");
      }
      return await tokenDataService.deleteToken(tokenToDelete[0].id);
    }
    return await tokenDataService.deleteToken(token[0].id);
  }

  async verifyToken(token: string, type: TokenTypeEnum, req?: Request): Promise<TokenType | Error> {
    try {
      const payload = Jwt.verify(token, env.JWT_SECRET) as JwtPayload;
      if (typeof payload.sub !== "string") {
        return new ApiError(StatusCodes.BAD_REQUEST, "Invalid Token");
      }
      const endTime = new Date(payload.endTime);
      const currentTime = new Date();
      // Todo Remove this line of code in the future :)
      if (!endTime || currentTime > endTime) {
        return new ApiError(StatusCodes.UNAUTHORIZED, "Token has expired");
      }

      const tokens = await tokenDataService.queryToken(token, type);
      if (!tokens.length) {
        return new ApiError(StatusCodes.NOT_FOUND, "Token not found");
      }

      if (req !== undefined) {
        const user = await userService.getUserById(payload.sub);
        if (!user || !user.responseObject) {
          return new ApiError(StatusCodes.UNAUTHORIZED, "Please authenticate");
        }

        req.user = {
          id: user.responseObject.id,
          email: user.responseObject.email,
        };

        req.token = payload;
        req.role = user.responseObject?.role;
      }

      return tokens[0];
    } catch (error) {
      if (error instanceof JsonWebTokenError)
        return new ApiError(StatusCodes.UNAUTHORIZED, "Token verification failed");
      if (error instanceof ApiError) return error;
      return new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, "Error while trying to verify token.");
    }
  }
}

export const tokenService = new TokenService();
