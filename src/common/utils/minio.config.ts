import { Environment } from "@/types";
import * as Minio from "minio";
import { env } from "./envConfig";

const { NODE_ENV } = env;
const ssl = NODE_ENV !== Environment.PRODUCTION;
export const minioClient = new Minio.Client({
  endPoint: env.MINIO_ENDPOINT,
  port: env.MINIO_PORT,
  useSSL: !ssl,
  accessKey: env.MINIO_ACCESS_KEY.trim(),
  secretKey: env.MINIO_SECRET_KEY.trim(),
});
