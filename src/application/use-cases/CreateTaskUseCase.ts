import { injectable, inject } from 'tsyringe';
import { Task } from '../../domain/entities/Task';
import { ITaskRepository } from '../../domain/repositories/ITaskRepository';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { CreateTaskDTO } from '../dto/CreateTaskDTO';
import { TaskResponseDTO, mapTaskToResponseDTO } from '../dto/TaskResponseDTO';
import { InvalidTaskDataException } from '../../domain/exceptions/InvalidTaskDataException';

@injectable()
export class CreateTaskUseCase {
  constructor(
    @inject('TaskRepository') private readonly taskRepository: ITaskRepository,
    @inject('UserRepository') private readonly userRepository: IUserRepository
  ) {}

  public async execute(dto: CreateTaskDTO, userId: string): Promise<TaskResponseDTO> {
    try {
      // Get user information
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new InvalidTaskDataException('User not found');
      }

      const task = Task.create(
        dto.title,
        dto.description,
        userId,
        dto.priority,
        dto.completed
      );

      const savedTask = await this.taskRepository.save(task);
      
      return mapTaskToResponseDTO(savedTask, user);
    } catch (error) {
      if (error instanceof Error) {
        throw new InvalidTaskDataException(error.message);
      }
      throw new InvalidTaskDataException('Failed to create task');
    }
  }
}