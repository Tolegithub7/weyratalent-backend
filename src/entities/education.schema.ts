import { sql } from "drizzle-orm";
import { check, doublePrecision, pgEnum, pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";
import { cv } from "./cv.entities";
import { timestamps } from "./timeStamp.schema";

export const education = pgTable(
  "education",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    cvId: uuid("cv_id")
      .notNull()
      .references(() => cv.id)
      .notNull(),
    degree: varchar("degree", { length: 255 }).notNull(),
    institution: varchar("institution", { length: 255 }).notNull(),
    start_date: varchar("start_date", { length: 10 }),
    end_date: varchar("end_date", { length: 10 }),
    gpa: doublePrecision("gpa").default(0.0),
    ...timestamps,
  },
  (table) => [check("gpa_check", sql`${table.gpa} >= 0 AND ${table.gpa} <= 4`)],
);
