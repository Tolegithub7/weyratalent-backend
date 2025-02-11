import { Experience, Gender } from "@/types/user.types";
import { date, pgEnum, pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "./timeStamp.schema";
import { users } from "./users.schema";

export const experienceEnum = pgEnum("experience", Object.values(Experience) as [string, ...string[]]);
export const genderEnum = pgEnum("gender", Object.values(Gender) as [string, ...string[]]);

export const talentProfile = pgTable("talent_profile", {
  id: uuid("id").defaultRandom().primaryKey(),
  profileUrl: text("profile_url"),
  fullName: text("full_name").notNull(),
  userId: uuid("user_id")
    .notNull()
    .unique()
    .references(() => users.id),
  nationality: text("nationality").notNull(),
  dateOfBirth: date("dob").notNull(),
  gender: genderEnum("gender").notNull(),
  experience: experienceEnum("experience").notNull(),
  socialLink: varchar("social_link", { length: 30 }),
  about: text("about"),
  ...timestamps,
});
