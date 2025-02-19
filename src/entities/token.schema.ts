import { TokenTypeEnum } from "@/types/token.types.";
import { boolean, pgEnum, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "./timeStamp.schema";
import { users } from "./users.schema";

export const tokenTypeEnum = pgEnum("token_type", Object.values(TokenTypeEnum) as [string, ...string[]]);

export const token = pgTable("token", {
  id: uuid("id").defaultRandom().primaryKey(),
  token: text("token").notNull(),
  userId: uuid("user_id")
    .notNull()
    .unique()
    .references(() => users.id),
  type: tokenTypeEnum("token_type").notNull(),
  expires: timestamp("expires", { mode: "date" }).notNull(),
  ...timestamps,
});
