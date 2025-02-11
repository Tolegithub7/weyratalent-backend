import { sql } from "drizzle-orm";
import { timestamp } from "drizzle-orm/mysql-core";

export function timestamps() {
  return {
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
    updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`).onUpdateNow().notNull(),
  };
}
