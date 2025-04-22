import { db } from "@/db/database.config";
import { otp } from "@/entities/otp.schema";
import { logger } from "@/server";
import { sql } from "drizzle-orm";
import cron from "node-cron";

export async function cleanupExpiredOtps() {
  try {
    logger.info("Running cleanup for expired OTPs...");
    const result = await db.delete(otp).where(sql`expires_at < NOW()`);

    logger.info(`Deleted ${result.rowCount} expired OTPs`);
    return result.rowCount;
  } catch (error) {
    logger.error("Error cleaning up expired OTPs:", error);
    throw error;
  }
}

export function startOtpCleanupCron() {
  // Run every hour at the 0 minute mark (e.g., 1:00, 2:00, etc.)
  cron.schedule("0 * * * *", async () => {
    logger.info("Checking for expired OTPs...");
    try {
      await cleanupExpiredOtps();
    } catch (error) {
      logger.error("Failed to complete OTP cleanup:", error);
    }
  });

  logger.info("OTP cleanup cron job scheduled successfully");
}
