import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { timestamps } from "./timeStamp.schema";

export const otp = pgTable("otp", {
  email: text("email").notNull(),
  otp: text("otp").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  ...timestamps,
});
