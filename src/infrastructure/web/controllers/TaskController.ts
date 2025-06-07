import { Request, Response, NextFunction } from 'express';
import { container } from 'tsyringe';
import { CreateTaskUseCase } from '../../../application/use-cases/CreateTaskUseCase';
import { GetUserTasksUseCase } from '../../../application/use-cases/GetUserTasksUseCase';
import { GetTaskByIdUseCase } from '../../../application/use-cases/GetTaskByIdUseCase';
import { UpdateTaskUseCase } from '../../../application/use-cases/UpdateTaskUseCase';
import { DeleteTaskUseCase } from '../../../application/use-cases/DeleteTaskUseCase';
import { CreateTaskDTO } from '../../../application/dto/CreateTaskDTO';
import { UpdateTaskDTO } from '../../../application/dto/UpdateTaskDTO';

export class TaskController {
  /**
   * @swagger
   * /api/tasks:
   *   post:
   *     summary: Create a new task
   *     description: Creates a new task for the authenticated user
   *     tags: [Tasks]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateTaskRequest'
   *     responses:
   *       201:
   *         description: Task created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Task created successfully
   *                 data:
   *                   $ref: '#/components/schemas/Task'
   *       400:
   *         description: Validation error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       401:
   *         description: Unauthorized - Authentication required
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  public async createTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const createTaskUseCase = container.resolve(CreateTaskUseCase);
      const taskData: CreateTaskDTO = req.body;
      const userId = req.user?.userId;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          error: {
            message: 'User authentication required',
            code: 'UNAUTHORIZED'
          }
        });
        return;
      }
      
      const task = await createTaskUseCase.execute(taskData, userId);
      
      res.status(201).json({
        message: 'Task created successfully',
        data: task
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/tasks:
   *   get:
   *     summary: Get all tasks
   *     description: Retrieves all tasks for the authenticated user. Admins can see all tasks.
   *     tags: [Tasks]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Tasks retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Tasks retrieved successfully
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Task'
   *       401:
   *         description: Unauthorized - Authentication required
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  public async getAllTasks(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const getUserTasksUseCase = container.resolve(GetUserTasksUseCase);
      const userId = req.user?.userId;
      const userRole = req.user?.role ?? 'user';
      
      if (!userId) {
        res.status(401).json({
          success: false,
          error: {
            message: 'User authentication required',
            code: 'UNAUTHORIZED'
          }
        });
        return;
      }
      
      const tasks = await getUserTasksUseCase.execute(userId, userRole);
      
      res.status(200).json({
        message: 'Tasks retrieved successfully',
        data: tasks
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/tasks/{id}:
   *   get:
   *     summary: Get task by ID
   *     description: Retrieves a specific task by its ID. Users can only access their own tasks unless they are admin.
   *     tags: [Tasks]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Task ID
   *         example: 60f7b3b3b3b3b3b3b3b3b3b3
   *     responses:
   *       200:
   *         description: Task retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Task retrieved successfully
   *                 data:
   *                   $ref: '#/components/schemas/Task'
   *       401:
   *         description: Unauthorized - Authentication required
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       404:
   *         description: Task not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  public async getTaskById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const getTaskByIdUseCase = container.resolve(GetTaskByIdUseCase);
      const taskId = req.params.id;
      const userId = req.user?.userId;
      const userRole = req.user?.role ?? 'user';
      
      if (!userId) {
        res.status(401).json({
          success: false,
          error: {
            message: 'User authentication required',
            code: 'UNAUTHORIZED'
          }
        });
        return;
      }
      
      const task = await getTaskByIdUseCase.execute(taskId, userId, userRole);
      
      res.status(200).json({
        message: 'Task retrieved successfully',
        data: task
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/tasks/{id}:
   *   put:
   *     summary: Update task
   *     description: Updates a specific task by its ID. Users can only update their own tasks unless they are admin.
   *     tags: [Tasks]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Task ID
   *         example: 60f7b3b3b3b3b3b3b3b3b3b3
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateTaskRequest'
   *     responses:
   *       200:
   *         description: Task updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Task updated successfully
   *                 data:
   *                   $ref: '#/components/schemas/Task'
   *       400:
   *         description: Validation error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       401:
   *         description: Unauthorized - Authentication required
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       404:
   *         description: Task not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  public async updateTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const updateTaskUseCase = container.resolve(UpdateTaskUseCase);
      const taskId = req.params.id;
      const taskData: UpdateTaskDTO = req.body;
      const userId = req.user?.userId;
      const userRole = req.user?.role ?? 'user';
      
      if (!userId) {
        res.status(401).json({
          success: false,
          error: {
            message: 'User authentication required',
            code: 'UNAUTHORIZED'
          }
        });
        return;
      }
      
      const task = await updateTaskUseCase.execute(taskId, taskData, userId, userRole);
      
      res.status(200).json({
        message: 'Task updated successfully',
        data: task
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @swagger
   * /api/tasks/{id}:
   *   delete:
   *     summary: Delete task
   *     description: Deletes a specific task by its ID. Users can only delete their own tasks unless they are admin.
   *     tags: [Tasks]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: Task ID
   *         example: 60f7b3b3b3b3b3b3b3b3b3b3
   *     responses:
   *       200:
   *         description: Task deleted successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Task deleted successfully
   *       401:
   *         description: Unauthorized - Authentication required
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       404:
   *         description: Task not found
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  public async deleteTask(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const deleteTaskUseCase = container.resolve(DeleteTaskUseCase);
      const taskId = req.params.id;
      const userId = req.user?.userId;
      const userRole = req.user?.role ?? 'user';
      
      if (!userId) {
        res.status(401).json({
          success: false,
          error: {
            message: 'User authentication required',
            code: 'UNAUTHORIZED'
          }
        });
        return;
      }
      
      await deleteTaskUseCase.execute(taskId, userId, userRole);
      
      res.status(200).json({
        message: 'Task deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}