import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { container } from 'tsyringe';
import { Logger } from './infrastructure/logging/Logger';
import { ITaskRepository } from './domain/repositories/ITaskRepository';
import { MongoTaskRepository } from './infrastructure/database/repositories/MongoTaskRepository';
import { IUserRepository } from './domain/repositories/IUserRepository';
import { MongoUserRepository } from './infrastructure/database/repositories/MongoUserRepository';
import { MongoDatabase } from './infrastructure/database/MongoDatabase';
import { ErrorHandler } from './infrastructure/web/middleware/ErrorHandler';
import { LoggingMiddleware } from './infrastructure/web/middleware/LoggingMiddleware';
import taskRoutes from './infrastructure/web/routes/taskRoutes';
import authRoutes from './infrastructure/web/routes/authRoutes';
import { RegisterUserUseCase } from './application/use-cases/RegisterUserUseCase';
import { LoginUserUseCase } from './application/use-cases/LoginUserUseCase';
import { CreateAdminUseCase } from './application/use-cases/CreateAdminUseCase';
import { setupSwagger } from './infrastructure/web/swagger';

// Initialize MongoDB connection
MongoDatabase.getInstance();

// Register dependencies
container.register<ITaskRepository>('TaskRepository', {
  useClass: MongoTaskRepository
});

container.register<IUserRepository>('UserRepository', {
  useClass: MongoUserRepository
});

// Register use cases
container.register<RegisterUserUseCase>('RegisterUserUseCase', {
  useClass: RegisterUserUseCase
});

container.register<LoginUserUseCase>('LoginUserUseCase', {
  useClass: LoginUserUseCase
});

container.register<CreateAdminUseCase>('CreateAdminUseCase', {
  useClass: CreateAdminUseCase
});

// Create Express app
const app = express();
const logger = Logger.getInstance();

// Apply middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(LoggingMiddleware.logRequest);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Setup Swagger documentation
setupSwagger(app);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString()
  });
});

// Error handling
app.use(ErrorHandler.handle);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: {
      message: 'Resource not found',
      status: 404,
      timestamp: new Date().toISOString()
    }
  });
});

export default app;