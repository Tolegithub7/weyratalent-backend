import { ApiError } from "@/common/models/serviceResponse";
import { catchAsync } from "@/common/utils/catchAsync.util";
import { handleServiceResponse } from "@/common/utils/httpHandlers";
import { favoriteJobsService } from "@/services/favoriteJobs.services";
import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

class FavoriteJobsController {
  public addFavoriteJob = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
    }
    const userId = req.user.id;
    const { jobProfileId } = req.body;
    const serviceResponse = await favoriteJobsService.addFavoriteJob(userId, jobProfileId);
    return handleServiceResponse(serviceResponse, res);
  });

  public getFavoriteJobs = catchAsync(async (req: Request, res: Response) => {
    const serviceResponse = await favoriteJobsService.getFavoriteJobs();
    return handleServiceResponse(serviceResponse, res);
  });

  public getFavoriteJob = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!req.user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
    }
    const userId = req.user.id;
    const serviceResponse = await favoriteJobsService.getFavoriteJob(userId, id);
    return handleServiceResponse(serviceResponse, res);
  });

  public getFavoriteJobsForRegisteredUser = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
    }
    const userId = req.user.id;
    const serviceResponse = await favoriteJobsService.getFavoriteJobForRegisteredUser(userId);
    return handleServiceResponse(serviceResponse, res);
  });

  public removeFavoriteJob = catchAsync(async (req: Request, res: Response) => {
    const { jobProfileId } = req.body;
    if (!req.user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
    }
    const userId = req.user.id;
    const serviceResponse = await favoriteJobsService.removeFavoriteJob(jobProfileId, userId);
    return handleServiceResponse(serviceResponse, res);
  });
}

export const favoriteJobsController = new FavoriteJobsController();
