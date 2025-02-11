import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "./timeStamp.schema";
import { users } from "./users.schema";

export const employerProfile = pgTable("employer_profile", {
  id: uuid("id").defaultRandom().primaryKey(),
  bannerUrl: varchar("banner_url", { length: 50 }).notNull(),
  userId: uuid("user_id")
    .notNull()
    .unique()
    .references(() => users.id),
  companyName: varchar("company_name", { length: 50 }).notNull(),
  about: varchar("about", { length: 500 }).notNull(),
  location: varchar("location", { length: 50 }).notNull(),
  phoneNumber: varchar("phone_number", { length: 15 }).notNull(),
  email: varchar("email", { length: 50 }).notNull().unique(),
  ...timestamps,
});
