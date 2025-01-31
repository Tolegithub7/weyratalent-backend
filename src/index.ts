import { logger, app } from "./server";
async function startServer() {
  
    try {
  
      const server = app.listen(3000, () => {
        logger.info(`Server development running on port http://localhost:3000`);
      });
  
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