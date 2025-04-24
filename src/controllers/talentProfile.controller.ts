import fs from "node:fs";
import path from "node:path";
import { ApiError } from "@/common/models/serviceResponse";
import { catchAsync } from "@/common/utils/catchAsync.util";
import { handleImageUpload } from "@/common/utils/handleFileUploads";
import { handleServiceResponse } from "@/common/utils/httpHandlers";
import { pick } from "@/common/utils/pick.utils";
import { talentProfileService } from "@/services/talentProfile.service";
import { UserRole } from "@/types";
import { BucketNameEnum } from "@/types/minio.types";
import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
class TalentProfileController {
  public createOrUpdateTalentProfile = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
    }
    if (!req.role || req.role !== UserRole.TALENT) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized access");
    }

    const userId = req.user.id;
    let profileUrl = "";
    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      if (files?.profile?.[0]) {
        const profileFilePath = path.join(files.profile[0].destination, files.profile[0].filename);
        console.log(profileFilePath);

        try {
          profileUrl = await handleImageUpload(
            files.profile[0].filename,
            userId,
            profileFilePath,
            BucketNameEnum.PROFILE,
          );
        } catch (error) {
          if (fs.existsSync(profileFilePath)) {
            fs.unlinkSync(profileFilePath);
          }
          throw new ApiError(
            StatusCodes.INTERNAL_SERVER_ERROR,
            `Failed to upload profile image: ${(error as Error).message}`,
          );
        }
      }
    }

    const serviceResponse = await talentProfileService.createOrUpdateTalentProfile(req.body, profileUrl, userId);
    return handleServiceResponse(serviceResponse, res);
  });

  public getTalentProfile = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
    }
    const { id } = req.params;
    const serviceResponse = await talentProfileService.getTalentProfile(id);
    return handleServiceResponse(serviceResponse, res);
  });

  public getTalentProfiles = catchAsync(async (req: Request, res: Response) => {
    const { country, experience, minHourlyRate, maxHourlyRate, primarySkill, page = 1, limit = 10 } = req.query;
    const serviceResponse = await talentProfileService.getTalentProfiles(
      {
        minHourlyRate: minHourlyRate ? Number(minHourlyRate) : undefined,
        maxHourlyRate: maxHourlyRate ? Number(maxHourlyRate) : undefined,
        country: country as string,
        experience: experience as string,
        primarySkill: primarySkill as string,
      },
      {
        page: Number(page),
        limit: Number(limit),
      },
    );
    return handleServiceResponse(serviceResponse, res);
  });

  public deleteTalentProfile = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
    }
    if (!req.role || req.role === UserRole.RECRUITER) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized access");
    }

    const { id } = req.params;
    const serviceResponse = await talentProfileService.deleteTalentProfile(id);
    return handleServiceResponse(serviceResponse, res);
  });

  public getRegisteredTalentProfile = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
    }
    if (!req.role || req.role !== UserRole.TALENT) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized access");
    }

    const userId = req.user.id;
    const serviceResponse = await talentProfileService.getRegisteredTalentProfile(userId);
    return handleServiceResponse(serviceResponse, res);
  });
}

export const talentProfileController = new TalentProfileController();
