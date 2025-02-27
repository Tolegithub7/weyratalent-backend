import { ApiError } from "@/common/models/serviceResponse";
import { catchAsync } from "@/common/utils/catchAsync.util";
import { handleServiceResponse } from "@/common/utils/httpHandlers";
import { pick } from "@/common/utils/pick.utils";
import { talentProfileService } from "@/services/talentProfile.service";
import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

class TalentProfileController {
  public createTalentProfile = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
    }

    const userId = req.user.id;
    const serviceResponse = await talentProfileService.createTalentProfile(req.body, userId);
    return handleServiceResponse(serviceResponse, res);
  });

  public getTalentProfile = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const serviceResponse = await talentProfileService.getTalentProfile(id);
    return handleServiceResponse(serviceResponse, res);
  });

  public getTalentProfiles = catchAsync(async (req: Request, res: Response) => {
    const serviceResponse = await talentProfileService.getTalentProfiles();
    return handleServiceResponse(serviceResponse, res);
  });

  public deleteTalentProfile = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const serviceResponse = await talentProfileService.deleteTalentProfile(id);
    return handleServiceResponse(serviceResponse, res);
  });

  public updateTalentProfile = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const serviceResponse = await talentProfileService.updateTalentProfile(id, req.body);
    return handleServiceResponse(serviceResponse, res);
  });
}

export const talentProfileController = new TalentProfileController();
