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
    const profile_dir = "./uploads/profile";

    [banner_dir, logo_dir, profile_dir].forEach((dir) => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });

    if (!_file) {
      return cb(null, "./uploads");
    }

    if (_file.fieldname === "banner") {
      cb(null, banner_dir);
    } else if (_file.fieldname === "profile") {
      cb(null, profile_dir);
    } else if (_file.fieldname === "logo") {
      cb(null, logo_dir);
    }
  },
  filename: (_req, file, cb) => {
    const fileExtension = path.extname(file.originalname);
    const fileName = `${uuidv4()}${fileExtension}`;
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
