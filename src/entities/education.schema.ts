import { sql } from "drizzle-orm";
import { check, doublePrecision, pgEnum, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
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
    start_date: timestamp("start_date", { mode: "date" }).notNull(),
    end_date: timestamp("end_date", { mode: "date" }),
    gpa: doublePrecision("gpa"),
    ...timestamps,
  },
  (table) => [check("gpa_check", sql`${table.gpa} >= 0 AND ${table.gpa} <= 4`)],
);
