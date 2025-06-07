import { injectable, inject } from 'tsyringe';
import { ITaskRepository } from '../../domain/repositories/ITaskRepository';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { TaskResponseDTO, mapTaskToResponseDTO } from '../dto/TaskResponseDTO';

@injectable()
export class GetTasksUseCase {
  constructor(
    @inject('TaskRepository') private readonly taskRepository: ITaskRepository,
    @inject('UserRepository') private readonly userRepository: IUserRepository
  ) {}

  public async execute(): Promise<TaskResponseDTO[]> {
    const tasks = await this.taskRepository.findAll();
    
    // Get all unique user IDs from tasks
    const userIds = [...new Set(tasks.map(task => task.getUserId()))];
    
    // Fetch all users for the tasks
    const users = await Promise.all(
      userIds.map(id => this.userRepository.findById(id))
    );
    
    // Create a map for quick user lookup
    const userMap = new Map();
    users.forEach((user: any) => {
      if (user) {
        userMap.set(user.getId(), user);
      }
    });
    
    // Map tasks to response DTOs with username
    return tasks.map(task => {
      const user = userMap.get(task.getUserId());
      if (!user) {
        throw new Error(`User not found for task ${task.getId()}`);
      }
      return mapTaskToResponseDTO(task, user);
    });
  }
}