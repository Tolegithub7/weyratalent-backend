import { date, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { cv } from "./cv.entities";
import { timestamps } from "./timeStamp.schema";

export const workExperience = pgTable("work_experience", {
  id: uuid("id").defaultRandom().primaryKey(),
  cvId: uuid("cv_id")
    .notNull()
    .references(() => cv.id),
  jobTitle: varchar("job_title", { length: 50 }).notNull(),
  company: varchar("company", { length: 55 }).notNull(),
  start_date: timestamp("start_date", { mode: "date" }).notNull(),
  end_date: timestamp("end_date", { mode: "date" }),
  ...timestamps,
});
