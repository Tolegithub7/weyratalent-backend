import { env } from "@/common/utils/envConfig";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "../entities/index";

export const pool = new Pool({
  host: env.DB_HOST,
  user: env.DB_USER,
  password: env.DB_PASS,
  port: env.DB_PORT,
  database: env.DB_NAME,
});

export const db = drizzle(pool, { schema });
