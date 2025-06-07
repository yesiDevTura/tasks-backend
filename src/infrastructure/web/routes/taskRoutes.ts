import { Router } from 'express';
import { TaskController } from '../controllers/TaskController';
import { ValidationMiddleware } from '../middleware/ValidationMiddleware';
import { AuthMiddleware } from '../middleware/AuthMiddleware';

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task management operations
 */

const taskRoutes = Router();
const taskController = new TaskController();

// GET /tasks - Get all tasks
taskRoutes.get(
  '/',
  AuthMiddleware.authenticate,
  taskController.getAllTasks.bind(taskController)
);

// GET /tasks/:id - Get a task by ID
taskRoutes.get(
  '/:id',
  AuthMiddleware.authenticate,
  ValidationMiddleware.validateTaskId(),
  taskController.getTaskById.bind(taskController)
);

// POST /tasks - Create a new task
taskRoutes.post(
  '/',
  AuthMiddleware.authenticate,
  ValidationMiddleware.validateCreateTask(),
  taskController.createTask.bind(taskController)
);

// PUT /tasks/:id - Update a task
taskRoutes.put(
  '/:id',
  AuthMiddleware.authenticate,
  ValidationMiddleware.validateUpdateTask(),
  taskController.updateTask.bind(taskController)
);

// DELETE /tasks/:id - Delete a task
taskRoutes.delete(
  '/:id',
  AuthMiddleware.authenticate,
  ValidationMiddleware.validateTaskId(),
  taskController.deleteTask.bind(taskController)
);

export default taskRoutes;