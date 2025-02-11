import { IndustryType, OrganizationType, TeamSize } from "@/types/employerProfile.types";
import { pgEnum, pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "./timeStamp.schema";

export const organizationTypeEnum = pgEnum(
  "organization_type",
  Object.values(OrganizationType) as [string, ...string[]],
);
export const industryTypeEnum = pgEnum("industry_type", Object.values(IndustryType) as [string, ...string[]]);
export const teamSizeEnum = pgEnum("team_size", Object.values(TeamSize) as [string, ...string[]]);

export const organizationInfo = pgTable("organization_info", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationType: organizationTypeEnum("organization_type").notNull(),
  industryType: industryTypeEnum("industry_type").notNull(),
  teamSize: teamSizeEnum("team_size").notNull(),
  companyVision: varchar("company_vision", { length: 500 }),
  ...timestamps,
});
