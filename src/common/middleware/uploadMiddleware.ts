import fs from "node:fs";
import path from "node:path";
import type { Request } from "express";
import { StatusCodes } from "http-status-codes";
import multer, { type FileFilterCallback } from "multer";
import { v4 as uuidv4 } from "uuid";
import { ApiError } from "../models/serviceResponse";

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const banner_dir = "./uploads/banner";
    const logo_dir = "./uploads/logo";

    if (!fs.existsSync("./uploads")) {
      fs.mkdirSync("./uploads");
    }

    if (!fs.existsSync(banner_dir)) {
      fs.mkdirSync(banner_dir);
    }

    if (!fs.existsSync(logo_dir)) {
      fs.mkdirSync(logo_dir);
    }

    if (_file.fieldname === "banner") {
      cb(null, banner_dir);
    } else {
      cb(null, logo_dir);
    }
  },
  filename: (_req, file, cb) => {
    const fileExtension = path.extname(file.originalname);
    const fileName = `${uuidv4()}${fileExtension}`; // Generate a unique filename using UUID
    cb(null, fileName);
  },
});

const limits = {
  fileSize: 5 * 1024 * 1024,
};

export const uploadImages = multer({
  storage: storage,
  limits: { fileSize: limits.fileSize },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new ApiError(StatusCodes.UNSUPPORTED_MEDIA_TYPE, "Only image files are allowed!"));
    }
  },
});
