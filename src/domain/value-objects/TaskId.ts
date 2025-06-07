import { v4 as uuidv4 } from 'uuid';

export class TaskId {
  private readonly value: string;

  private constructor(id: string) {
    this.value = id;
  }

  public static create(): TaskId {
    return new TaskId(uuidv4());
  }

  public static fromExisting(id: string): TaskId {
    if (!id) {
      throw new Error('Task ID cannot be empty');
    }
    return new TaskId(id);
  }

  public getValue(): string {
    return this.value;
  }

  public equals(id?: TaskId): boolean {
    if (id === null || id === undefined) {
      return false;
    }
    return this.value === id.value;
  }
}