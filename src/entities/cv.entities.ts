import { Categories } from "@/types/cv.types";
import { relations, sql } from "drizzle-orm";
import { check, integer, pgEnum, pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";
import { education } from "./education.schema";
import { project } from "./project.schema";
import { timestamps } from "./timeStamp.schema";
import { users } from "./users.schema";
import { workExperience } from "./workExperience.schema";

export const categoriesEnum = pgEnum("categories", Object.values(Categories) as [string, ...string[]]);

export const cv = pgTable(
  "cv",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    fullName: text("full_name").notNull(),
    userId: uuid("user_id")
      .notNull()
      .unique()
      .references(() => users.id),
    skillTitle: text("skill_title").notNull(),
    hourlyRate: integer("hourly_rate").notNull().default(0).$type<number>(),
    categories: categoriesEnum("categories").notNull(),
    ...timestamps,
  },
  (table) => [check("hourly_rate_check", sql`${table.hourlyRate} >= 0 AND ${table.hourlyRate} <= 100`)],
);

export const cvRelations = relations(cv, ({ one, many }) => ({
  user: one(users, {
    fields: [cv.userId],
    references: [users.id],
  }),
  workExperience: many(workExperience),
  education: many(education),
  projects: many(project),
}));
