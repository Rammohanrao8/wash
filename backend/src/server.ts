import http from 'http';
import app from './app';
import { config } from './config';
import { connectDatabase, disconnectDatabase } from './config/database';
import { initializeSocket } from './sockets';
import { logger } from './config/logger';

async function startServer() {
  try {
    // 1. Connect to Database
    await connectDatabase();

    // 2. Create HTTP server
    const server = http.createServer(app);

    // 3. Initialize Socket.IO
    initializeSocket(server);

    // 4. Start listening
    server.listen(config.port, () => {
      logger.info(`
      =======================================================
      🚀 Server running in ${config.nodeEnv} mode on port ${config.port}
      📚 Swagger docs available at http://localhost:${config.port}/api-docs
      =======================================================
      `);
    });

    // 5. Handle graceful shutdown
    const gracefulShutdown = async (signal: string) => {
      logger.info(`Received ${signal}. Shutting down gracefully...`);
      server.close(async () => {
        logger.info('HTTP server closed');
        await disconnectDatabase();
        process.exit(0);
      });

      // Force close if it takes too long
      setTimeout(() => {
        logger.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle uncaught exceptions and rejections globally
process.on('uncaughtException', (error) => {
  logger.error('UNCAUGHT EXCEPTION! Shutting down...', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  logger.error('UNHANDLED REJECTION! Shutting down...', reason);
  process.exit(1);
});

startServer();
