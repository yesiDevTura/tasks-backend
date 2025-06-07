import { injectable, inject } from 'tsyringe';
import { ITaskRepository } from '../../domain/repositories/ITaskRepository';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { UpdateTaskDTO } from '../dto/UpdateTaskDTO';
import { TaskResponseDTO, mapTaskToResponseDTO } from '../dto/TaskResponseDTO';
import { TaskNotFoundException } from '../../domain/exceptions/TaskNotFoundException';
import { InvalidTaskDataException } from '../../domain/exceptions/InvalidTaskDataException';
import { TaskDomainService } from '../../domain/services/TaskDomainService';

@injectable()
export class UpdateTaskUseCase {
  constructor(
    @inject('TaskRepository') private readonly taskRepository: ITaskRepository,
    @inject('UserRepository') private readonly userRepository: IUserRepository,
    private readonly taskDomainService: TaskDomainService = new TaskDomainService()
  ) {}

  public async execute(id: string, dto: UpdateTaskDTO, userId: string, userRole: string): Promise<TaskResponseDTO> {
    let task;
    
    // Si es admin, puede actualizar cualquier tarea
    if (userRole === 'admin') {
      task = await this.taskRepository.findById(id);
    } else {
      // Si es usuario normal, solo puede actualizar sus propias tareas
      task = await this.taskRepository.findByIdAndUserId(id, userId);
    }
    
    if (!task) {
      throw new TaskNotFoundException(id);
    }

    try {
      if (dto.title !== undefined) {
        task.updateTitle(dto.title);
      }
      
      if (dto.description !== undefined) {
        task.updateDescription(dto.description);
      }
      
      if (dto.completed !== undefined) {
        task.updateCompleted(dto.completed);
      }
      
      if (dto.priority !== undefined) {
        task.updatePriority(dto.priority);
      }

      const updatedTask = await this.taskRepository.update(task);
      
      // Get the user information for the task creator
      const user = await this.userRepository.findById(updatedTask.getUserId());
      if (!user) {
        throw new Error(`User not found for task ${updatedTask.getId()}`);
      }
      
      return mapTaskToResponseDTO(updatedTask, user);
    } catch (error) {
      if (error instanceof Error) {
        throw new InvalidTaskDataException(error.message);
      }
      throw new InvalidTaskDataException('Failed to update task');
    }
  }
}