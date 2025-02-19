import { ServiceResponse } from "@/common/models/serviceResponse";
import { catchAsync } from "@/common/utils/catchAsync.util";
import { handleServiceResponse } from "@/common/utils/httpHandlers";
import { AuthService } from "@/services/auth/auth.service";
import { TokenService } from "@/services/token.service";
import { UserService } from "@/services/user.service";
import { UserResponseType } from "@/types";
import { AccessAndRefreshTokens } from "@/types/token.types.";
import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

class AuthController {
  private userService: UserService;
  private authService: AuthService;
  private tokenService: TokenService;

  constructor() {
    this.userService = new UserService();
    this.authService = new AuthService();
    this.tokenService = new TokenService();
  }

  public login = catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await this.authService.loginWithEmailAndPassword(email, password);
    const tokens = await this.tokenService.generateAccessAndRefreshToken(user);
    const { password: p, ...otherUserFields } = user;
    return handleServiceResponse(
      ServiceResponse.success("Login successful", {
        user: {
          ...otherUserFields,
        },
        tokens,
      }),
      res,
    );
  });
}

export const authController = new AuthController();
