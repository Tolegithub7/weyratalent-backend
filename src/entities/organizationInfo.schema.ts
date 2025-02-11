import { IndustryType, OrganizationType, TeamSize } from "@/types/employerProfile.types";
import { pgEnum, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "./timeStamp.schema";
import { users } from "./users.schema";

export const organizationTypeEnum = pgEnum(
  "organization_type",
  Object.values(OrganizationType) as [string, ...string[]],
);
export const industryTypeEnum = pgEnum("industry_type", Object.values(IndustryType) as [string, ...string[]]);
export const teamSizeEnum = pgEnum("team_size", Object.values(TeamSize) as [string, ...string[]]);

export const organizationInfo = pgTable("organization_info", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .unique()
    .references(() => users.id),
  organizationType: organizationTypeEnum("organization_type").notNull(),
  industryType: industryTypeEnum("industry_type").notNull(),
  teamSize: teamSizeEnum("team_size").notNull(),
  companyVision: varchar("company_vision", { length: 500 }),
  instagramLink: varchar("instagram_link", { length: 50 }),
  telegramLink: varchar("telegram_link", { length: 50 }),
  facebookLink: varchar("facebook_link", { length: 50 }),
  xLink: varchar("X_link", { length: 50 }),
  ...timestamps,
});
