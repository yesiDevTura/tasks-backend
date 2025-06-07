import { Task } from '../../domain/entities/Task';
import { User } from '../../domain/entities/User';

export interface TaskResponseDTO {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  userId: string;
  username: string;
}

export function mapTaskToResponseDTO(task: Task, user: User): TaskResponseDTO {
  const taskJson = task.toJSON();
  return {
    id: taskJson.id,
    title: taskJson.title,
    description: taskJson.description,
    status: taskJson.completed ? 'completed' : 'pending',
    priority: taskJson.priority,
    createdAt: taskJson.createdAt,
    updatedAt: taskJson.updatedAt,
    completedAt: taskJson.completedAt,
    userId: taskJson.userId,
    username: user.getUsername()
  };
}