import { ApiError } from "@/common/models/serviceResponse";
import { catchAsync } from "@/common/utils/catchAsync.util";
import { handleServiceResponse } from "@/common/utils/httpHandlers";
import { appliedJobsService } from "@/services/appliedJobs.services";
import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

class AppliedJobsController {
  public newApplication = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
    }
    const userId = req.user.id;
    const { jobProfileId, coverLetter } = req.body;
    const serviceResponse = await appliedJobsService.newApplication(userId, jobProfileId, coverLetter);
    return handleServiceResponse(serviceResponse, res);
  });

  public getJobApplications = catchAsync(async (req: Request, res: Response) => {
    const serviceResponse = await appliedJobsService.getJobApplications();
    return handleServiceResponse(serviceResponse, res);
  });

  public getApplication = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const serviceResponse = await appliedJobsService.getApplication(id);
    return handleServiceResponse(serviceResponse, res);
  });

  public getApplicationForRegisteredTalent = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
    }

    const userId = req.user.id;
    const serviceResponse = await appliedJobsService.getApplicationForRegisteredTalent(userId);
    return handleServiceResponse(serviceResponse, res);
  });
}

export const appliedJobsController = new AppliedJobsController();
