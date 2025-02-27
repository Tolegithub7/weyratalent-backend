import { ApiError } from "@/common/models/serviceResponse";
import { catchAsync } from "@/common/utils/catchAsync.util";
import { handleServiceResponse } from "@/common/utils/httpHandlers";
import { employerProfileService } from "@/services/employerProfile.service";
import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

class EmployerProfileController {
  public createEmployerProfile = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
    }
    const userId = req.user.id;
    const serviceResponse = await employerProfileService.createEmployerProfile(req.body, userId);
    return handleServiceResponse(serviceResponse, res);
  });

  public getEmployerProfile = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const serviceResponse = await employerProfileService.getEmployerProfile(id);
    return handleServiceResponse(serviceResponse, res);
  });

  public getEmployerProfiles = catchAsync(async (req: Request, res: Response) => {
    const serviceResponse = await employerProfileService.getEmployerProfiles();
    return handleServiceResponse(serviceResponse, res);
  });

  public updateEmployerProfile = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const serviceResponse = await employerProfileService.updateEmployerProfile(id, req.body);
    return handleServiceResponse(serviceResponse, res);
  });

  public deleteEmployerProfile = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const serviceResponse = await employerProfileService.deleteEmployerProfile(id);
    return handleServiceResponse(serviceResponse, res);
  });
}

export const employerProfileController = new EmployerProfileController();
