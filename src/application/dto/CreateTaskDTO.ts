export interface CreateTaskDTO {
  title: string;
  description: string;
  completed: boolean;
  priority?: string;
}