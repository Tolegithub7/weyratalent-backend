import { relations } from "drizzle-orm";
import { date, pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";
import { timestamps } from "./timeStamp.schema";
import { users } from "./users.schema";

export const blog = pgTable("blog", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),
  blogPicUrl: text("blog_pic_url"),
  blogHeader: text("blog_header"),
  blogBody: text("blog_body"),
  ...timestamps,
});

export const blogRelations = relations(blog, ({ one }) => ({
  user: one(users, {
    fields: [blog.userId],
    references: [users.id],
  }),
}));
