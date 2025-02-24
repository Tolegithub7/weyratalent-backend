import { ApiError } from "@/common/models/serviceResponse";
import { catchAsync } from "@/common/utils/catchAsync.util";
import { handleServiceResponse } from "@/common/utils/httpHandlers";
import { jobPostingService } from "@/services/jobPosting.service";
import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

class JobPostingController {
  public createJobPosting = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
    }

    const userId = req.user.id;
    const serviceResponse = await jobPostingService.createJobPosting(req.body, userId);
    return handleServiceResponse(serviceResponse, res);
  });

  public getJobPosting = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const serviceResponse = await jobPostingService.getJobPosting(id);
    return handleServiceResponse(serviceResponse, res);
  });

  public getJobPostings = catchAsync(async (req: Request, res: Response) => {
    const serviceResponse = await jobPostingService.getJobPostings();
    return handleServiceResponse(serviceResponse, res);
  });

  public deleteJobPosting = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const serviceResponse = await jobPostingService.deleteJobPosting(id);
    return handleServiceResponse(serviceResponse, res);
  });

  public updateJobPosting = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const serviceResponse = await jobPostingService.updateJobPosting(id, req.body);
    return handleServiceResponse(serviceResponse, res);
  });
}

export const jobPostingController = new JobPostingController();
