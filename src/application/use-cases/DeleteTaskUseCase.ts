import { injectable, inject } from 'tsyringe';
import { ITaskRepository } from '../../domain/repositories/ITaskRepository';
import { TaskNotFoundException } from '../../domain/exceptions/TaskNotFoundException';

@injectable()
export class DeleteTaskUseCase {
  constructor(
    @inject('TaskRepository') private taskRepository: ITaskRepository
  ) {}

  public async execute(id: string, userId: string, userRole: string): Promise<void> {
    let task;
    
    // Si es admin, puede eliminar cualquier tarea
    if (userRole === 'admin') {
      task = await this.taskRepository.findById(id);
      if (!task) {
        throw new TaskNotFoundException(id);
      }
      
      const deleted = await this.taskRepository.delete(id);
      if (!deleted) {
        throw new Error(`Failed to delete task with ID "${id}"`);
      }
    } else {
      // Si es usuario normal, solo puede eliminar sus propias tareas
      task = await this.taskRepository.findByIdAndUserId(id, userId);
      if (!task) {
        throw new TaskNotFoundException(id);
      }
      
      const deleted = await this.taskRepository.deleteByIdAndUserId(id, userId);
      if (!deleted) {
        throw new Error(`Failed to delete task with ID "${id}"`);
      }
    }
  }
}