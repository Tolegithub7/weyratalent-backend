import { pgTable, uuid } from "drizzle-orm/pg-core";
import { jobProfile } from "./jobPosting.schema";
import { timestamps } from "./timeStamp.schema";
import { users } from "./users.schema";

export const favoriteJobs = pgTable("favorite_jobs", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  jobProfileId: uuid("job_profile_id")
    .references(() => jobProfile.id)
    .notNull(),
  ...timestamps,
});
