import { UserRole } from "@/types";
import { sql } from "drizzle-orm";
import { check, pgEnum, pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "./timeStamp.schema";

console.log(Object.values(UserRole) as [string, ...string[]]);
export const roleEnum = pgEnum("role", Object.values(UserRole) as [string, ...string[]]);

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    email: varchar("email", { length: 50 }).notNull().unique(),
    phoneNumber: varchar("phone_number", { length: 15 }).notNull(),
    password: text("password").notNull(),
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
