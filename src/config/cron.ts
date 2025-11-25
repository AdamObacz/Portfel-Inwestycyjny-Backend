import cron from "node-cron";
import { AppDataSource } from "../config/database";
import { User } from "../entities/User";
import * as ReportService from "../services/ReportService";

const userRepository = AppDataSource.getRepository(User);

/**
 * Cron job to create daily snapshots for all users
 * Runs every day at 00:01 (1 minute after midnight)
 */
export function initSnapshotCronJob() {
  // Schedule: At 00:01 every day
  cron.schedule("1 0 * * *", async () => {
    console.log("[CRON] Starting daily snapshot creation...");

    try {
      // Get all users
      const users = await userRepository.find();

      let successCount = 0;
      let errorCount = 0;

      // Create snapshot for each user
      for (const user of users) {
        try {
          await ReportService.createSnapshot(user.id);
          successCount++;
        } catch (error: any) {
          console.error(`[CRON] Failed to create snapshot for user ${user.id}:`, error.message);
          errorCount++;
        }
      }

      console.log(`[CRON] Daily snapshot creation completed. Success: ${successCount}, Errors: ${errorCount}`);
    } catch (error: any) {
      console.error("[CRON] Fatal error during snapshot creation:", error.message);
    }
  });

  console.log("✓ Daily snapshot cron job initialized (runs at 00:01 every day)");
}

export default { initSnapshotCronJob };
