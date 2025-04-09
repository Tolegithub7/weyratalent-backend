import { JobLevel, JobRole, JobType, SalaryType, StatusType, Vacancies, DurationUnit, DurationValue } from "@/types";
import { sql } from "drizzle-orm";
import { doublePrecision, pgEnum, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "./timeStamp.schema";
import { users } from "./users.schema";

export const jobLevelEnum = pgEnum("job_level", Object.values(JobLevel) as [string, ...string[]]);
export const jobRoleEnum = pgEnum("job_role", Object.values(JobRole) as [string, ...string[]]);
export const jobTypeEnum = pgEnum("job_type", Object.values(JobType) as [string, ...string[]]);
export const salaryEnum = pgEnum("salary_type", Object.values(SalaryType) as [string, ...string[]]);
export const vacancyEnum = pgEnum("vacancies", Object.values(Vacancies) as [string, ...string[]]);
export const statusTypeEnum = pgEnum("status", Object.values(StatusType) as [string, ...string[]]);
export const durationUnitEnum = pgEnum("duration_unit", Object.values(DurationUnit) as [string, ...string[]]);
export const durationValueEnum = pgEnum("duration_value", Object.values(DurationValue) as [string, ...string[]]);

export const jobProfile = pgTable("job_posting", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  jobTitle: varchar("job_title", { length: 50 }),
  jobRole: jobRoleEnum("job_role").notNull(),
  jobType: jobTypeEnum("job_type").notNull(),
  jobLevel: jobLevelEnum("job_level").notNull(),
  salaryType: salaryEnum("salary_type").notNull(),
  vacancies: vacancyEnum("vacancies").notNull(),
  description: text("description").notNull(),
  responsibilities: text("responsibilities").notNull(),
  minSalary: doublePrecision("min_salary").default(0.0),
  maxSalary: doublePrecision("max_salary").notNull().default(0.0),
  expiryDate: timestamp("expiry_date").notNull(),
  status: statusTypeEnum("status").notNull().default(StatusType.ACTIVE),
  durationValue: durationValueEnum("duration_value").notNull(),
  durationUnit: durationUnitEnum("duration_unit").notNull(),
  // status: varchar("status", { length: 10 }).$default(
  //   () => sql`CASE WHEN CURRENT_TIMESTAMP < expiry_date THEN 'active' ELSE 'expired' END`,
  // ),
  ...timestamps,
});
