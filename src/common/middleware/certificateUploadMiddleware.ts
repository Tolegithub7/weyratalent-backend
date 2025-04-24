import fs from "node:fs";
import path from "node:path";
import type { Request } from "express";
import { StatusCodes } from "http-status-codes";
import multer, { type FileFilterCallback } from "multer";
import { v4 as uuidv4 } from "uuid";
import { ApiError } from "../models/serviceResponse";

// Configure storage for certificate files
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const certificate_dir = "./uploads/certificate";

    // Create the certificate directory if it doesn't exist
    if (!fs.existsSync(certificate_dir)) {
      fs.mkdirSync(certificate_dir, { recursive: true });
    }

    // Save files to the certificate directory
    cb(null, certificate_dir);
  },
  filename: (_req, file, cb) => {
    // Generate a unique filename using UUID and the original file extension
    const fileExtension = path.extname(file.originalname);
    const fileName = `${uuidv4()}${fileExtension}`;
    cb(null, fileName);
  },
});

// Define file size limits (50MB)
const limits = {
  fileSize: 50 * 1024 * 1024, // 50MB
};

// Define allowed file types
const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
  const allowedMimeTypes = [
    "application/pdf", // PDF files
    "application/msword", // DOC files
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // DOCX files
    "application/vnd.oasis.opendocument.text", // ODT files
  ];

  // Check if the file's MIME type is allowed
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true); // Accept the file
  } else {
    cb(
      new ApiError(
        StatusCodes.UNSUPPORTED_MEDIA_TYPE,
        "Only PDF, DOC, DOCX, and ODT files are allowed for certificates!",
      ),
    );
  }
};

// Export the configured multer middleware for certificate uploads
export const uploadCertificate = multer({
  storage: storage, // Use disk storage
  limits: limits, // Apply file size limits
  fileFilter: fileFilter, // Apply file type filtering
}).fields([
  //+
  { name: "certificate", maxCount: 1 }, //+
  // Define all other fields that might be in the form to prevent "Unexpected field" error//+
  { name: "fullName", maxCount: 1 }, //+
  { name: "skillTitle", maxCount: 1 }, //+
  { name: "hourlyRate", maxCount: 1 }, //+
  { name: "categories", maxCount: 1 }, //+
  { name: "workExperience", maxCount: 1 }, //+
  { name: "education", maxCount: 1 }, //+
  { name: "project", maxCount: 1 }, //+
]); //+

// import path from "path";
// import type { Request } from "express";
// import { StatusCodes } from "http-status-codes";
// import multer, { type FileFilterCallback } from "multer";
// import { v4 as uuidv4 } from "uuid";
// import { ApiError } from "../models/serviceResponse";

// const storage = multer.memoryStorage(); // Store files in memory

// const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
//   const allowedMimeTypes = [
//     "image/jpeg",
//     "image/png",
//     "image/gif",
//     "application/pdf",
//     "application/msword",
//     "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//   ];

//   if (allowedMimeTypes.includes(file.mimetype)) {
//     cb(null, true);
//   } else {
//     cb(
//       new ApiError(
//         StatusCodes.UNSUPPORTED_MEDIA_TYPE,
//         "Only images (JPEG, PNG, GIF) and documents (PDF, DOC, DOCX) are allowed!",
//       ),
//     );
//   }
// };

// export const uploadCertificate = multer({
//   storage: storage,
//   limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
//   fileFilter: fileFilter,
// });

// // import fs from "node:fs";
// // import path from "node:path";
// // import { StatusCodes } from "http-status-codes";
// // import multer, { type FileFilterCallback } from "multer";
// // import { v4 as uuidv4 } from "uuid";
// // import { ApiError } from "../models/serviceResponse";
// // import { Request } from "express";

// // const storage = multer.diskStorage({
// //   destination: (_req, _file, cb) => {
// //     const certificate_dir = "./uploads/certificate";
// //     if (!fs.existsSync(certificate_dir)) {
// //       fs.mkdirSync(certificate_dir, { recursive: true });
// //     } // create directory if it doesn't exist
// //     cb(null, certificate_dir);
// //   },
// //   filename: (_req, file, cb) => {
// //     const fileExtension = path.extname(file.originalname);
// //     const fileName = `${uuidv4()}${fileExtension}`;
// //     cb(null, fileName);
// //   },
// // });

// // const limits = {
// //   fileSize: 50 * 1024 * 1024,
// // };

// // const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
// //   const allowedMimeTypes = [
// //     "image/jpeg",
// //     "image/png",
// //     "image/gif",
// //     "application/pdf", // Allow PDF files
// //     "application/msword", // Allow DOC files
// //     "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // Allow DOCX files
// //   ];

// //   if (allowedMimeTypes.includes(file.mimetype)) {
// //     cb(null, true); // Accept the file
// //   } else {
// //     cb(
// //       new ApiError(
// //         StatusCodes.UNSUPPORTED_MEDIA_TYPE,
// //         "Only images (JPEG, PNG, GIF) and documents (PDF, DOC, DOCX) are allowed for certificates!"
// //       )
// //     );
// //   }
// // };

// // // Export the configured multer middleware for certificate uploads
// // export const uploadCertificate = multer({
// //   storage: storage,
// //   limits: { fileSize: limits.fileSize },
// //   fileFilter: fileFilter,
// // });
