import fs from "node:fs";
import path from "node:path";
import { ApiError } from "@/common/models/serviceResponse";
import { catchAsync } from "@/common/utils/catchAsync.util";
import { handleImageUpload } from "@/common/utils/handleFileUploads";
import { handleServiceResponse } from "@/common/utils/httpHandlers";
import { employerProfileService } from "@/services/employerProfile.service";
import { BucketNameEnum } from "@/types/minio.types";
import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

class EmployerProfileController {
  public createEmployerProfile = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
    }
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const bannerFile = files.banner[0];
    const logoFile = files.logo[0];
    const bannerFilePath = path.join(bannerFile.destination, bannerFile.filename);
    const logoFilePath = path.join(logoFile.destination, logoFile.filename);

    console.log(logoFilePath, bannerFilePath);

    let bannerUrl: string;
    let logoUrl: string;
    try {
      bannerUrl = await handleImageUpload(bannerFile.filename, bannerFilePath, BucketNameEnum.BANNER);
      logoUrl = await handleImageUpload(logoFile.filename, logoFilePath, BucketNameEnum.LOGO);
    } catch (error) {
      if (fs.existsSync(logoFilePath)) {
        fs.unlinkSync(logoFilePath);
      }
      if (fs.existsSync(bannerFilePath)) {
        fs.unlinkSync(bannerFilePath);
      }
      throw new ApiError(
        StatusCodes.INTERNAL_SERVER_ERROR,
        `Failed·to·upload·logo·or·banner·image: ${(error as Error).message}`,
      );
    }
    const userId = req.user.id;
    const serviceResponse = await employerProfileService.createEmployerProfile(req.body, bannerUrl, logoUrl, userId);
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
