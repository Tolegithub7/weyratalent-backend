import dotenv from "dotenv";
import { bool, cleanEnv, email, host, makeValidator, num, port, str, testOnly } from "envalid";

const envFile = process.env.NODE_ENV === "test" ? ".env.test" : ".env";
dotenv.config({ path: envFile });

type EnvironmentType = "test" | "development" | "production";
enum Environment {
  DEVELOPMENT = "development",
  PRODUCTION = "production",
  TEST = "test",
}

export const env = cleanEnv(process.env, {
  NODE_ENV: str<EnvironmentType>({
    devDefault: testOnly("test"),
    choices: [Environment.DEVELOPMENT, Environment.PRODUCTION, Environment.TEST],
  }),
  HOST: host({ devDefault: testOnly("localhost") }),
  PORT: port({ devDefault: testOnly(3000) }),
  BASE_API: str({ devDefault: testOnly("/api/v1") }),
  //Database
  DB_PORT: port({ devDefault: testOnly(8599) }),
  DB_HOST: str({ devDefault: testOnly("localhost") }),
  DB_USER: str({ devDefault: testOnly("weyra") }),
  DB_PASS: str({ devDefault: testOnly("password") }),
  DB_NAME: str({ devDefault: testOnly("weyratech_test") }),
  DB_URL: str(),

  //JWT
  JWT_SECRET: str(),
  JWT_ACCESS_EXPIRATION_MINUTES: num(),
  JWT_REFRESH_EXPIRATION_DAYS: num(),

  //MINIO
  MINIO_ENDPOINT: str({ devDefault: testOnly("localhost") }),
  MINIO_PORT: port({ devDefault: testOnly(9000) }),
  MINIO_ACCESS_KEY: str(),
  MINIO_SECRET_KEY: str(),

  //SMPT
  SMTP_HOST: str(),
  SMTP_PORT: port(),
  SMTP_USER: str(),
  SMTP_PASS: str(),
  SMPT_SERVICE: str({
    default: "smtp",
  }),
  EMAIL_FROM: str(),
});
