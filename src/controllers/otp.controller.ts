import { ApiError } from "@/common/models/serviceResponse";
import { catchAsync } from "@/common/utils/catchAsync.util";
import { handleServiceResponse } from "@/common/utils/httpHandlers";
import { otpService } from "@/services/otp.service";
import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

class OTPController {
  public generateOtp = catchAsync(async (req: Request, res: Response) => {
    const { email } = req.body;
    const serviceResponse = await otpService.generateOtp(email);
    return handleServiceResponse(serviceResponse, res);
  });
}

export const otpController = new OTPController();
