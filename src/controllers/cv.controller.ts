import path from "path";
import { ApiError } from "@/common/models/serviceResponse";
import { catchAsync } from "@/common/utils/catchAsync.util";
import { env } from "@/common/utils/envConfig";
import { handleServiceResponse } from "@/common/utils/httpHandlers";
import { minioClient } from "@/common/utils/minio.config";
import { pick } from "@/common/utils/pick.utils";
import { cvService } from "@/services/cv.service";
import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { v4 as uuidv4 } from "uuid";
import { handleCertificateUpload } from "@/common/utils/handleFileUploads"; 
import { BucketNameEnum } from "@/types/minio.types";

class CVController {
  public create = catchAsync(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
    }
    const userId = req.user.id;
    // const certificate = (req.file as Express.Multer.File) || {};
    const certificateFile = req.file; 
    let certificateUrl: string | undefined;
    // const certificateData = {
    //   filePath: certificate ? certificate.path : null,
    // };
    if (certificateFile) {
      // Upload the certificate file to MinIO
      certificateUrl = await handleCertificateUpload(
        certificateFile.originalname, // File name
        userId, // User ID
        certificateFile.path, // Temporary file path
        BucketNameEnum.CERTIFICATE
      );
    }
    const cvData = {
      ...req.body,
      certificateUrl,
    };

    const serviceResponse = await cvService.create(cvData, userId);
    return handleServiceResponse(serviceResponse, res);
  });

  public getCv = catchAsync(async (req: Request, res: Response) => {
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
    const serviceResponse = await cvService.getAllCvs();
    if (serviceResponse.responseObject) {
      const updatedResponseObject = serviceResponse.responseObject.map((cv) => {
        const certificatePath = (cv.certificate as any)?.filePath || null;
        return {
          ...cv,
          certificate: certificatePath
            ? {
                filePath: certificatePath,
              }
            : undefined,
        };
      });

      return handleServiceResponse(
        {
          ...serviceResponse,
          responseObject: updatedResponseObject,
        },
        res,
      );
    }

    return handleServiceResponse(serviceResponse, res);
  });

  public deleteCv = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const serviceResponse = await cvService.deleteCv(id);
    return handleServiceResponse(serviceResponse, res);
  });

  public updateCv = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const serviceResponse = await cvService.updateCv(id, req.body);
    return handleServiceResponse(serviceResponse, res);
  });
}

export const cvController = new CVController();
