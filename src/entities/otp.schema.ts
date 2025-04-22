import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { timestamps } from "./timeStamp.schema";

export const otp = pgTable("otp", {
  email: text("email"),
  otp: text("otp"),
  expiresAt: timestamp("expires_at"),
  ...timestamps,
});
