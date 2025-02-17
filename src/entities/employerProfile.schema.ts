import { pgTable, uuid, varchar, text, pgEnum, jsonb } from "drizzle-orm/pg-core";
import { timestamps } from "./timeStamp.schema";
import { users } from "./users.schema";
import { OrganizationType, IndustryType, TeamSize } from "../types/employerProfile.types";

export const organizationTypeEnum = pgEnum("organization_type", Object.values(OrganizationType) as [string, ...string[]]);
export const industryTypeEnum = pgEnum("industry_type", Object.values(IndustryType) as [string, ...string[]]);
export const teamSizeEnum = pgEnum("team_size", Object.values(TeamSize) as [string, ...string[]]);

export const employerProfile = pgTable("employer_profile", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull().unique(),
  
  // Company Info
  logoUrl: varchar("logo_url", { length: 255 }),
  bannerUrl: varchar("banner_url", { length: 255 }).notNull(),
  companyName: varchar("company_name", { length: 100 }).notNull(),
  about: text("about").notNull(),
  location: varchar("location", { length: 100 }).notNull(),
  phoneNumber: varchar("phone_number", { length: 20 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  
  // Founding Info
  organizationType: organizationTypeEnum("organization_type").notNull(),
  industryType: industryTypeEnum("industry_type").notNull(),
  teamSize: teamSizeEnum("team_size").notNull(),
  yearEstablished: varchar("year_established", { length: 4 }).notNull(),
  website: varchar("website", { length: 255 }).notNull(),
  vision: text("vision").notNull(),
  instagramLink: varchar("instagram_link", { length: 50 }),
  telegramLink: varchar("telegram_link", { length: 50 }),
  facebookLink: varchar("facebook_link", { length: 50 }),
  xLink: varchar("X_link", { length: 50 }),

  ...timestamps,
});