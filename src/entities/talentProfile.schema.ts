import { Country, Experience, Gender, Nationality } from "@/types/user.types";
import { relations, sql } from "drizzle-orm";
import { date, pgEnum, pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "./timeStamp.schema";
import { users } from "./users.schema";

export const experienceEnum = pgEnum("experience", Object.values(Experience) as [string, ...string[]]);
export const genderEnum = pgEnum("gender", Object.values(Gender) as [string, ...string[]]);
export const countryEnum = pgEnum("country", Object.values(Country) as [string, ...string[]]);
export const nationalityEnum = pgEnum("nationality", Object.values(Nationality) as [string, ...string[]]);

export const talentProfile = pgTable("talent_profile", {
  id: uuid("id").defaultRandom().primaryKey(),
  profileUrl: text("profile_url"),
  fullName: text("full_name").notNull(),
  userId: uuid("user_id")
    .notNull()
    .unique()
    .references(() => users.id),
  country: countryEnum("country").notNull(),
  personalWebsite: varchar("personal_website", { length: 255 }),
  about: text("about"),
  nationality: nationalityEnum("nationality").notNull(),
  dateOfBirth: date("dob").notNull(),
  gender: genderEnum("gender").notNull(),
  experience: experienceEnum("experience").notNull(),
  socialLink: varchar("social_link", { length: 255 }),
  ...timestamps,
});

export const talentProfileRelations = relations(talentProfile, ({ one }) => ({
  user: one(users, {
    fields: [talentProfile.userId], // The foreign key in talentProfile
    references: [users.id], // The primary key in users
  }),
}));
