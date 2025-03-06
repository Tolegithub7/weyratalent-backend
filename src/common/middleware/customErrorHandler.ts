import { logger } from "@/server";
import type { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { StatusCodes, getReasonPhrase } from "http-status-codes";
import { ApiError, ServiceResponseError } from "../models/serviceResponse";
import { env } from "../utils/envConfig";

export const errorConverter = (err: any, req: Request, res: Response, next: NextFunction) => {
  let error = err;
  if (!(err instanceof ApiError)) {
    const statusCode: number = error.statusCode || 500;
    const message: string = err.messages || getReasonPhrase(statusCode);
    error = new ApiError(statusCode, message, false, err.stack);
  }
  next(error);
};

export const errorHandler = (err: ApiError, req: Request, res: Response, next: NextFunction) => {
  let { statusCode, message } = err;
  if (env.NODE_ENV === "production" && !err.isOperational) {
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    message = getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR);
  }
  res.locals.errorMessage = err.message;
  const resSer = ServiceResponseError.failure(
    message,
    {
      code: statusCode,
      message,
      ...(env.NODE_ENV === "development" && { stack: err.stack }),
    },
    statusCode,
  );
  if (env.NODE_ENV === "development") {
    logger.error(`${statusCode} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  }
  res.status(statusCode).json(resSer);
};
export default () => [errorConverter, errorHandler];
