import * as Minio from "minio";
import { env } from "./envConfig";

export const minioClient = new Minio.Client({
  endPoint: env.MINIO_ENDPOINT,
  port: env.MINIO_PORT,
  useSSL: false,
  accessKey: env.MINIO_ACCESS_KEY.trim(),
  secretKey: env.MINIO_SECRET_KEY.trim(),
});
