import { env } from "./common/utils/envConfig";
import { startCronJobs } from "./common/utils/jobExpiryCheck.util";
import { minioClient } from "./common/utils/minio.config";
import { db, pool } from "./db/database.config";
import { app, logger } from "./server";
async function startServer() {
  const { NODE_ENV, HOST, PORT } = env;
  const backgroundJobs = async () => {
    try {
      startCronJobs();
    } catch (error) {
      console.error("Error occured while starting one of the jobs: ", (error as Error).message);
    }
  };
  const testDBConnection = async () => {
    try {
      await pool.connect();
      logger.info("✅ Database connected successfully");
    } catch (error) {
      console.error("❌ Database connection failed:", error);
    }
  };

  const testMinioConnection = async () => {
    try {
      await minioClient.listBuckets();
      logger.info("Minio Server Connected successfully!");
    } catch (error) {
      console.error("Minio Server Connection failed:", error);
    }
  };

  try {
    const server = app.listen(PORT, () => {
      logger.info(`Server ${NODE_ENV} running on port http://${HOST}:${PORT}`);
    });

    testDBConnection();
    testMinioConnection();
    backgroundJobs();
    const onCloseSignal = () => {
      logger.info("sigint received, shutting down");
      server.close(() => {
        logger.info("server closed");
        process.exit();
      });
      setTimeout(() => process.exit(1), 10000).unref();
    };

    process.on("SIGINT", onCloseSignal);
    process.on("SIGTERM", onCloseSignal);
  } catch (error) {
    logger.error("Server failed to start:", error);
    process.exit(1);
  }
}
startServer();
