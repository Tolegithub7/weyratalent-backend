import { pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";
import { cv } from "./cv.entities";
import { timestamps } from "./timeStamp.schema";

export const workExperience = pgTable("work_experience", {
  id: uuid("id").defaultRandom().primaryKey(),
  cvId: uuid("cv_id")
    .notNull()
    .references(() => cv.id),
  jobTitle: varchar("job_title", { length: 50 }).notNull(),
  company: varchar("company", { length: 55 }).notNull(),
  start_date: varchar("start_date", { length: 10 }),
  end_date: varchar("end_date", { length: 10 }),
  ...timestamps,
});
