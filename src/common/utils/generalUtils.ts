import path from "node:path";
import { Environment } from "@/types";
import { env } from "./envConfig";

export const PROJECT_ROOT =
  env.NODE_ENV === Environment.DEVELOPMENT
    ? process.cwd()
    : require.main?.path?.replace(/\/dist$/, "") || process.cwd(); // Fallback to cwd if require.main is unavailable

export const BACKEND_URL =
  env.NODE_ENV === Environment.DEVELOPMENT ? `http://${env.HOST}:${env.PORT}/${env.BASE_API}` : "";
