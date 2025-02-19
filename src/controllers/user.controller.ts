import { catchAsync } from "@/common/utils/catchAsync.util";
import { handleServiceResponse } from "@/common/utils/httpHandlers";
import { userService } from "@/services/user.service";
import type { Request, Response } from "express";

class UserController {
  public getUsers = catchAsync(async (req: Request, res: Response) => {
    const serviceResponse = await userService.findAllUsers();
    return handleServiceResponse(serviceResponse, res);
  });

  public getUser = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const serviceResponse = await userService.getUserById(id);
    return handleServiceResponse(serviceResponse, res);
  });

  public updateUser = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const serviceResponse = await userService.updateUser(id, req.body);
    return handleServiceResponse(serviceResponse, res);
  });

  public deleteUser = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const serviceResponse = await userService.deleteUser(id);
    return handleServiceResponse(serviceResponse, res);
  });

  public createUser = catchAsync(async (req: Request, res: Response) => {
    const serviceResponse = await userService.createUser(req.body);
    return handleServiceResponse(serviceResponse, res);
  });
}

export const userController = new UserController();
