import { injectable } from 'tsyringe';
import { Task } from '../../../domain/entities/Task';
import { ITaskRepository } from '../../../domain/repositories/ITaskRepository';
import { Logger } from '../../logging/Logger';
import { TaskModel, TaskDocument } from '../schemas/TaskSchema';
import { Types } from 'mongoose';
import { TaskNotFoundException } from '../../../domain/exceptions/TaskNotFoundException';

@injectable()
export class MongoTaskRepository implements ITaskRepository {
  private readonly logger: Logger;

  constructor() {
    this.logger = Logger.getInstance();
  }  private mapToEntity(task: TaskDocument): Task {
    return Task.reconstitute({
      id: (task._id as any).toString(),
      title: task.title,
      description: task.description || '',
      completed: task.completed,
      priority: task.priority,
      userId: task.userId,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt
    });
  }

  private mapToDocument(task: Task): any {
    return {
      title: task.getTitle(),
      description: task.getDescription(),
      completed: task.getCompleted(),
      priority: task.getPriority(),
      userId: task.getUserId(),
    };
  }

  async findAll(): Promise<Task[]> {
    try {
      const tasks = await TaskModel.find().sort({ createdAt: -1 });
      return tasks.map(task => this.mapToEntity(task));
    } catch (error) {
      this.logger.error('Error getting all tasks', { error });
      throw error;
    }
  }
  async findById(id: string): Promise<Task | null> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        return null;
      }
      
      const task = await TaskModel.findById(id);
      return task ? this.mapToEntity(task) : null;
    } catch (error) {
      this.logger.error('Error getting task by id', { error, id });
      throw error;
    }
  }
  async create(task: Task): Promise<Task> {
    try {
      const newTask = await TaskModel.create(this.mapToDocument(task));
      return this.mapToEntity(newTask);
    } catch (error) {
      this.logger.error('Error creating task', { error, task });
      throw error;
    }
  }

  async save(task: Task): Promise<Task> {
    return this.create(task);
  }
  async update(task: Task): Promise<Task> {
    try {
      if (!Types.ObjectId.isValid(task.getId())) {
        throw new TaskNotFoundException(`Task with ID ${task.getId()} not found`);
      }
      
      const updatedTask = await TaskModel.findByIdAndUpdate(
        task.getId(),
        this.mapToDocument(task),
        { new: true, runValidators: true }
      );
      
      if (!updatedTask) {
        throw new TaskNotFoundException(`Task with ID ${task.getId()} not found`);
      }
      
      return this.mapToEntity(updatedTask);
    } catch (error) {
      this.logger.error('Error updating task', { error, taskId: task.getId() });
      throw error;
    }
  }
  async delete(id: string): Promise<boolean> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        return false;
      }
      
      const result = await TaskModel.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      this.logger.error('Error deleting task', { error, id });
      throw error;
    }
  }

  async findByUserId(userId: string): Promise<Task[]> {
    try {
      const tasks = await TaskModel.find({ userId }).sort({ createdAt: -1 });
      return tasks.map(task => this.mapToEntity(task));
    } catch (error) {
      this.logger.error('Error getting tasks by user id', { error, userId });
      throw error;
    }
  }

  async findByIdAndUserId(id: string, userId: string): Promise<Task | null> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        return null;
      }
      
      const task = await TaskModel.findOne({ _id: id, userId });
      return task ? this.mapToEntity(task) : null;
    } catch (error) {
      this.logger.error('Error getting task by id and user id', { error, id, userId });
      throw error;
    }
  }

  async deleteByIdAndUserId(id: string, userId: string): Promise<boolean> {
    try {
      if (!Types.ObjectId.isValid(id)) {
        return false;
      }
      
      const result = await TaskModel.findOneAndDelete({ _id: id, userId });
      return !!result;
    } catch (error) {
      this.logger.error('Error deleting task by id and user id', { error, id, userId });
      throw error;
    }
  }
}
