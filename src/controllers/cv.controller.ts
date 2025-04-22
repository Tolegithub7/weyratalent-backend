import { ApiError } from "@/common/models/serviceResponse";
import { catchAsync } from "@/common/utils/catchAsync.util";
import { handleServiceResponse } from "@/common/utils/httpHandlers";
import { pick } from "@/common/utils/pick.utils";
import { cvService } from "@/services/cv.service";
import { StatusCodes } from "http-status-codes";

import { UserRole } from "@/types";
import type { Request, Response } from "express";

class CVController {
  public create = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
    }
    if (!req.role || req.role !== UserRole.TALENT) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized access");
    }
    const userId = req.user.id;
    const serviceResponse = await cvService.create(req.body, userId);
    return handleServiceResponse(serviceResponse, res);
  });

  public getCvById = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
    }
    const { id } = req.params;
    const serviceResponse = await cvService.getCv(id);
    return handleServiceResponse(serviceResponse, res);
  });

  public getCvByUserId = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
    }
    const userId = req.user.id;
    const serviceResponse = await cvService.getCvByUserId(userId);
    return handleServiceResponse(serviceResponse, res);
  });

  public getAllCvs = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
    }
    const serviceResponse = await cvService.getAllCvs();
    return handleServiceResponse(serviceResponse, res);
  });

  public deleteCv = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
    }
    if (!req.role || req.role !== UserRole.TALENT) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized access");
    }

    const { id } = req.params;
    const serviceResponse = await cvService.deleteCv(id);
    return handleServiceResponse(serviceResponse, res);
  });

  public updateCv = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
    }
    if (!req.role || req.role !== UserRole.TALENT) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized access");
    }

    const { id } = req.params;
    const serviceResponse = await cvService.updateCv(id, req.body);
    return handleServiceResponse(serviceResponse, res);
  });
}

export const cvController = new CVController();
