import { defineConfig } from "drizzle-kit";
import { env } from "./src/common/utils/envConfig";

console.log(env.DB_PORT);
export default defineConfig({
  out: "./migrations",
  dialect: "postgresql",
  schema: "./src/entities/index.ts",

  // driver: "pg",
  dbCredentials: {
    host: env.DB_HOST,
    database: env.DB_NAME,
    user: env.DB_USER,
    password: env.DB_PASS,
    port: Number(env.DB_PORT),
    // connectionString: env.DB_URL,
    ssl: false,
  },

  extensionsFilters: ["postgis"],
  schemaFilter: "public",
  tablesFilter: "*",

  introspect: {
    casing: "camel",
  },

  migrations: {
    prefix: "timestamp",
    table: "__drizzle_migrations__",
    schema: "public",
  },

  // entities: {
  //   roles: {
  //     provider: "",
  //     exclude: [],
  //     include: [],
  //   },
  // },

  breakpoints: true,
  strict: true,
  verbose: true,
});