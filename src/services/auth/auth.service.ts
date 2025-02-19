import { ApiError } from "@/common/models/serviceResponse";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";
import type { UserResponseType, UserWithTokens } from "@/types";
import type { UserType } from "@/types";
import { TokenTypeEnum } from "@/types/token.types.";
import bcrypt from "bcrypt";
import { StatusCodes } from "http-status-codes";
import { tokenService } from "../token.service";
import { userService } from "../user.service";

export class AuthService {
  checkIfPasswordMatch(unencryptedPassword: string, encryptedPassword: string) {
    return bcrypt.compareSync(unencryptedPassword, encryptedPassword);
  }

  public async loginWithEmailAndPassword(email: string, password: string): Promise<UserType> {
    try {
      const user = await userService.getByEmail(email);

      const isValid = await this.checkIfPasswordMatch(password, user.password);
      if (!isValid) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid email or password");
      }
      return user;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid email or password");
    }
  }
}

export const authService = new AuthService();
