import { injectable, inject } from 'tsyringe';
import { ITaskRepository } from '../../domain/repositories/ITaskRepository';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { TaskResponseDTO, mapTaskToResponseDTO } from '../dto/TaskResponseDTO';

@injectable()
export class GetUserTasksUseCase {  constructor(
    @inject('TaskRepository') private readonly taskRepository: ITaskRepository,
    @inject('UserRepository') private readonly userRepository: IUserRepository
  ) {}

  public async execute(userId: string, userRole: string): Promise<TaskResponseDTO[]> {
    let tasks;
    
    // Si es admin, puede ver todas las tareas
    if (userRole === 'admin') {
      tasks = await this.taskRepository.findAll();
    } else {
      // Si es usuario normal, solo ve sus tareas
      tasks = await this.taskRepository.findByUserId(userId);
    }
    
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
