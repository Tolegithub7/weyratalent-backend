import fs from "node:fs";
import path from "node:path";
import type { BucketNameEnum } from "@/types/minio.types";
import { v4 as uuidv4 } from "uuid";
import { env } from "./envConfig";
import { minioClient } from "./minio.config";

export const handleImageUpload = async (
  fileName: string,
  userId: string,
  filePath: string,
  bucketName: BucketNameEnum,
) => {
  console.log("-----------------WE ARE HERE-------------", fileName, filePath);
  const bucket = bucketName;
  const destinationObject = userId;

  const exists = await minioClient.bucketExists(bucket);
  if (exists) {
    console.log(`Bucket ${bucket} exists.`);
  } else {
    await minioClient.makeBucket(bucket, "us-east-1");
    console.log(`Bucket ${bucket} created·in·"us-east-1".`);
  }

  const bucketPolicy = {
    Version: "2012-10-17",
    Statement: [
      {
        Effect: "Allow",
        Principal: "*",
        Action: ["s3:GetObject"],
        Resource: [`arn:aws:s3:::${bucket}/*`],
      },
    ],
  };

  await minioClient.setBucketPolicy(bucket, JSON.stringify(bucketPolicy));
  console.log("Bucket policy set to public read access.");

  const fileExtension = path.extname(fileName).toLowerCase();
  // Mapping of file extensions to MIME types
  const mimeTypes: { [key: string]: string } = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".bmp": "image/bmp",
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
  };

  const mimeType = mimeTypes[fileExtension.toLowerCase()] || "application/octet-stream";

  const metaData = {
    "Content-Type": mimeType,
    "X-Amz-Meta-Testing": 1234,
    "X-Amz-Meta-Description": `${bucket} image`,
    example: 5678,
  };

  console.log("----------------I AM HERE ----- ----- --", fileName, filePath, metaData);
  try {
    await minioClient.fPutObject(bucket, destinationObject, filePath, metaData);
    console.log("Image uploaded successfully.");
    const publicUrl = `http://${env.MINIO_ENDPOINT}:${env.MINIO_PORT}/${bucket}/${destinationObject}`;
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return publicUrl;
  } catch (error) {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    throw new Error(`Failed to upload image: ${(error as Error).message}`);
  }
};
