import { pgTable, serial, text } from "drizzle-orm/pg-core";

export const posts = pgTable("posts", {
  id: serial().primaryKey(),
  title: text(),
  description: text(),
});
