import { ApplicationStatus } from "@/types";
import { pgEnum, pgTable, uuid } from "drizzle-orm/pg-core";
import { jobProfile } from "./jobPosting.schema";
import { timestamps } from "./timeStamp.schema";
import { users } from "./users.schema";

export const applicationStatusEnum = pgEnum(
  "application_status",
  Object.values(ApplicationStatus) as [string, ...string[]],
);

export const appliedJobs = pgTable("applied_jobs", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  jobProfileId: uuid("job_profile_id")
    .references(() => jobProfile.id)
    .notNull(),
  applicationStatus: applicationStatusEnum("application_status").default(ApplicationStatus.PENDING).notNull(),
  ...timestamps,
});
