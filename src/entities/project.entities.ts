import { pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";
import { cv } from "./cv.entities";
import { timestamps } from "./timeStamp.schema";

export const project = pgTable("project", {
  id: uuid("id").defaultRandom().primaryKey(),
  cvId: uuid("cv_id")
    .notNull()
    .references(() => cv.id),
  description: text("description").notNull(),
  projectLink: varchar("project_link", { length: 55 }).notNull(),
  ...timestamps,
});
