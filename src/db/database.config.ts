import { env } from "@/common/utils/envConfig";
import { drizzle } from "drizzle-orm/node-postgres";
import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";
import { Pool } from "pg";

const pool = new Pool({
  host: env.DB_HOST,
  user: env.DB_USER,
  password: env.DB_PASS,
  port: env.DB_PORT,
});

export const db = drizzle({ client: pool });
