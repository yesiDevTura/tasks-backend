import { Task } from '../entities/Task';
import { TaskStatus, TaskStatusValue } from '../value-objects/TaskStatus';
import { TaskPriority, TaskPriorityValue } from '../value-objects/TaskPriority';

export class TaskDomainService {
  public validateTaskTransition(currentStatus: string, newStatus: string): boolean {
    // Define valid transitions
    const validTransitions: Record<string, string[]> = {
      [TaskStatusValue.TODO]: [TaskStatusValue.IN_PROGRESS, TaskStatusValue.DONE],
      [TaskStatusValue.IN_PROGRESS]: [TaskStatusValue.TODO, TaskStatusValue.DONE],
      [TaskStatusValue.DONE]: [TaskStatusValue.TODO, TaskStatusValue.IN_PROGRESS]
    };

    return validTransitions[currentStatus]?.includes(newStatus) || false;
  }

  public calculateTaskCompletionStats(tasks: Task[]): {
    total: number;
    completed: number;
    inProgress: number;
    pending: number;
    completionRate: number;
  } {
    const total = tasks.length;
    const completed = tasks.filter(task => task.isCompleted()).length;
    const pending = tasks.filter(task => !task.isCompleted()).length;
    const inProgress = 0; // Por simplicidad, no distinguimos entre pending e in-progress
    const completionRate = total > 0 ? (completed / total) * 100 : 0;

    return {
      total,
      completed,
      inProgress,
      pending,
      completionRate
    };
  }

  public getPriorityTasks(tasks: Task[], priorityLevel: TaskPriorityValue): Task[] {
    return tasks.filter(task => task.getPriority() === priorityLevel);
  }
}