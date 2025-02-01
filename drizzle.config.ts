import { defineConfig } from "drizzle-kit";
import { env } from "./src/common/utils/envConfig";

export default defineConfig({
  out: "./migrations",
  dialect: "postgresql",
  schema: "./src/entities/index.ts",

  driver: "pglite",
  dbCredentials: {
    url: `postgresql://${env.DB_USER}:${env.DB_PASS}@${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}`,
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

  entities: {
    roles: {
      provider: "",
      exclude: [],
      include: [],
    },
  },

  breakpoints: true,
  strict: true,
  verbose: true,
});
