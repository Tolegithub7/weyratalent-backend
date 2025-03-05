import { Country, UserRole } from "@/types";
import { sql } from "drizzle-orm";
import { boolean, check, pgEnum, pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "./timeStamp.schema";

console.log(Object.values(UserRole) as [string, ...string[]]);
export const roleEnum = pgEnum("role", Object.values(UserRole) as [string, ...string[]]);
export const countryEnum = pgEnum("country", Object.values(Country) as [string, ...string[]]);

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    fullName: text("full_name"),
    userName: varchar("user_name", { length: 50 }).unique(),
    email: varchar("email", { length: 50 }).notNull().unique(),
    country: countryEnum("country").notNull(),
    password: text("password").notNull(),
    companyName: varchar("company_name", { length: 100 }),
    address: text("address"),
    phoneNumber: varchar("phone_number", { length: 15 }),
    verifiedLicense: text("verified_license"),
    agreeTermsService: boolean("agree_terms_service").default(false).notNull(),
    role: roleEnum("role").notNull(),
    ...timestamps,
  },
  (table) => [
    check(
      "phone_number_length_check",
      sql`LENGTH(${table.phoneNumber}) BETWEEN 10 AND 15 
          AND ${table.phoneNumber} ~ '^[+]?[0-9]+$'`,
    ),
  ],
);
