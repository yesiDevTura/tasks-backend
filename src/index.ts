import 'dotenv/config';
import app from './app';
import { Logger } from './infrastructure/logging/Logger';
import { MongoDatabase } from './infrastructure/database/MongoDatabase'; // Importa la clase de MongoDB

const port = process.env.PORT || 3000;
const logger = Logger.getInstance();

// Initialize database connections
// Inicializa MongoDB
try {
  // La clase MongoDatabase se inicializa mediante getInstance() y se conecta automáticamente
  MongoDatabase.getInstance();
  logger.info('MongoDB connection initialization started');
} catch (error) {
  logger.error('Error initializing MongoDB', error);
}

// Start the server
app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Handle graceful shutdown
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

async function gracefulShutdown() {
  logger.info('Shutting down gracefully...');
  
  try {
    await MongoDatabase.getInstance().close(); // Cierra la conexión a MongoDB usando la instancia
    logger.info('Database connections closed');
    process.exit(0);
  } catch (error) {
    logger.error('Error during graceful shutdown', error);
    process.exit(1);
  }
}