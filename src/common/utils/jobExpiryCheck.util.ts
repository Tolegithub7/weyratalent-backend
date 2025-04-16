import { db } from "@/db/database.config";
import { jobProfile } from "@/entities";
import { logger } from "@/server";
import { StatusType } from "@/types";
import cron from "node-cron";

import { and, eq, lt } from "drizzle-orm";
import { sql } from "drizzle-orm";

export async function updateExpiredJobs() {
  try {
    console.error("Running update query for expired jobs...");
    logger.info("StatusType values:", { ACTIVE: StatusType.ACTIVE, EXPIRED: StatusType.EXPIRED });
    const result = await db.execute(
      sql`UPDATE job_posting SET status = ${StatusType.EXPIRED} WHERE expiry_date < CURRENT_TIMESTAMP AND status = ${StatusType.ACTIVE} RETURNING id`,
    );
    logger.info(`Updated ${result.rows.length} job postings to expired.`);
  } catch (error) {
    logger.error("Error updating expired jobs:", {
      error: error,
    });
  }
}
export function startCronJobs() {
  logger.info("Cron job started successfully");
  cron.schedule("*/15 * * * *", async () => {
    logger.info("Checking for expired job postings...");
    await updateExpiredJobs();
    logger.info("Expired job postings updated.");
  });
}
