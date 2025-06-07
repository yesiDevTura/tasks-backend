export class TaskNotFoundException extends Error {
  constructor(id: string) {
    super(`Task with ID "${id}" not found`);
    this.name = 'TaskNotFoundException';
  }
}