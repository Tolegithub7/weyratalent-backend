import { env } from "@/common/utils/envConfig";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

export const pool = new Pool({
  host: env.DB_HOST,
  user: env.DB_USER,
  password: env.DB_PASS,
  port: env.DB_PORT,
  database: env.DB_NAME,
});

export const db = drizzle({ client: pool });
