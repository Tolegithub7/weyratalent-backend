import fs from "node:fs";
import path from "node:path";
import { ApiError } from "@/common/models/serviceResponse";
import { catchAsync } from "@/common/utils/catchAsync.util";
import { handleImageUpload } from "@/common/utils/handleFileUploads";
import { handleServiceResponse } from "@/common/utils/httpHandlers";
import { employerProfileService } from "@/services/employerProfile.service";
import { UserRole } from "@/types";
import { BucketNameEnum } from "@/types/minio.types";
import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

class EmployerProfileController {
  public createOrUpdateEmployerProfile = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
    }

    if (!req.role || req.role !== UserRole.RECRUITER) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized access");
    }

    let bannerUrl = "";
    let logoUrl = "";

    const userId = req.user.id;
    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      if (files?.banner?.[0]) {
        const bannerFile = files.banner[0];
        const bannerFilePath = path.join(bannerFile.destination, bannerFile.filename);

        try {
          bannerUrl = await handleImageUpload(bannerFile.filename, userId, bannerFilePath, BucketNameEnum.BANNER);
        } catch (error) {
          if (fs.existsSync(bannerFilePath)) {
            fs.unlinkSync(bannerFilePath);
          }
          throw new ApiError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            `Failed to upload banner image: ${(error as Error).message}`,
          );
        }
      }

      if (files?.logo?.[0]) {
        const logoFile = files.logo[0];
        const logoFilePath = path.join(logoFile.destination, logoFile.filename);

        try {
          logoUrl = await handleImageUpload(logoFile.filename, userId, logoFilePath, BucketNameEnum.LOGO);
        } catch (error) {
          if (fs.existsSync(logoFilePath)) {
            fs.unlinkSync(logoFilePath);
          }
          throw new ApiError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            `Failed to upload logo image: ${(error as Error).message}`,
          );
        }
      }
    }

    const serviceResponse = await employerProfileService.createOrUpdateEmployerProfile(
      req.body,
      bannerUrl,
      logoUrl,
      userId,
    );

    return handleServiceResponse(serviceResponse, res);
  });

  public getEmployerProfile = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
    }
    const { id } = req.params;
    const serviceResponse = await employerProfileService.getEmployerProfile(id);
    return handleServiceResponse(serviceResponse, res);
  });

  public getEmployerProfiles = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
    }
    const serviceResponse = await employerProfileService.getEmployerProfiles();
    return handleServiceResponse(serviceResponse, res);
  });

  public deleteEmployerProfile = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
    }
    if (!req.role || req.role === UserRole.TALENT) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized access");
    }

    const { id } = req.params;
    const serviceResponse = await employerProfileService.deleteEmployerProfile(id);
    return handleServiceResponse(serviceResponse, res);
  });

  public getRegisteredEmployerProfile = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
    }
    if (!req.role || req.role !== UserRole.RECRUITER) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized access");
    }

    const userId = req.user.id;
    const serviceResponse = await employerProfileService.getRegisteredEmployerProfile(userId);
    return handleServiceResponse(serviceResponse, res);
  });
}

export const employerProfileController = new EmployerProfileController();
