import { catchAsync } from "@/common/utils/catchAsync.util";
import { handleServiceResponse } from "@/common/utils/httpHandlers";
import { authService } from "@/services/auth/auth.service";
import type { Request, Response } from "express";
class LogoutController {
  public logout = catchAsync(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;
    const serviceResponse = await authService.logout(refreshToken);
    return handleServiceResponse(serviceResponse, res);
  });
}

export const logoutController = new LogoutController();
