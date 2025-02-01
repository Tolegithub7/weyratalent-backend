import { env } from "./common/utils/envConfig";
import { db, pool } from "./db/database.config";
import { app, logger } from "./server";
async function startServer() {
  const { NODE_ENV, HOST, PORT } = env;
  const testConnection = async () => {
    try {
      await pool.connect();
      logger.info("✅ Database connected successfully");
    } catch (error) {
      console.error("❌ Database connection failed:", error);
    }
  };

  try {
    const server = app.listen(PORT, () => {
      logger.info(`Server ${NODE_ENV} running on port http://${HOST}:${PORT}`);
    });

    testConnection();
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
