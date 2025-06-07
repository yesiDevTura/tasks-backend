import mongoose from 'mongoose';
import { Logger } from '../logging/Logger';
import 'dotenv/config';

export class MongoDatabase {
  private static instance: MongoDatabase;
  private logger: Logger;
  private isConnected: boolean = false;

  private constructor() {
    this.logger = Logger.getInstance();
    this.connect().catch(err => {
      this.logger.error('Failed to connect to MongoDB', { error: err });
    });
  }

  public static getInstance(): MongoDatabase {
    if (!MongoDatabase.instance) {
      MongoDatabase.instance = new MongoDatabase();
    }
    return MongoDatabase.instance;
  }
  private async connect(): Promise<void> {
    try {
      // Usar MONGODB_URI en lugar de MONGO_URI para mantener consistencia
      if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI environment variable is not defined');
      }

      if (this.isConnected) {
        this.logger.info('MongoDB is already connected');
        return;
      }

      await mongoose.connect(process.env.MONGODB_URI);
      this.isConnected = true;
      this.logger.info('Connected to MongoDB');
    } catch (error) {
      this.isConnected = false;
      this.logger.error('Error connecting to MongoDB', { error });
      throw error;
    }
  }

  public async close(): Promise<void> {
    if (this.isConnected) {
      await mongoose.disconnect();
      this.isConnected = false;
      this.logger.info('MongoDB connection closed');
    }
  }

  public getConnection(): typeof mongoose {
    if (!this.isConnected) {
      this.logger.warn('MongoDB is not connected, attempting to connect');
      this.connect().catch(err => {
        this.logger.error('Failed to reconnect to MongoDB', { error: err });
      });
    }
    return mongoose;
  }
}
