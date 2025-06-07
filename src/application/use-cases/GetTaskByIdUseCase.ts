import { injectable, inject } from 'tsyringe';
import { ITaskRepository } from '../../domain/repositories/ITaskRepository';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { TaskResponseDTO, mapTaskToResponseDTO } from '../dto/TaskResponseDTO';
import { TaskNotFoundException } from '../../domain/exceptions/TaskNotFoundException';

@injectable()
export class GetTaskByIdUseCase {
  constructor(
    @inject('TaskRepository') private readonly taskRepository: ITaskRepository,
    @inject('UserRepository') private readonly userRepository: IUserRepository
  ) {}

  public async execute(id: string, userId: string, userRole: string): Promise<TaskResponseDTO> {
    let task;
    
    // Si es admin, puede ver cualquier tarea
    if (userRole === 'admin') {
      task = await this.taskRepository.findById(id);
    } else {
      // Si es usuario normal, solo puede ver sus propias tareas
      task = await this.taskRepository.findByIdAndUserId(id, userId);
    }
    
    if (!task) {
      throw new TaskNotFoundException(id);
    }

    // Get the user information for the task creator
    const user = await this.userRepository.findById(task.getUserId());
    if (!user) {
      throw new Error(`User not found for task ${task.getId()}`);
    }
    
    return mapTaskToResponseDTO(task, user);
  }
}