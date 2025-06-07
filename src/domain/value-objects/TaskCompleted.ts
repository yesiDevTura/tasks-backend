export class TaskCompleted {
  private readonly value: boolean;

  private constructor(completed: boolean) {
    this.value = completed;
  }

  public static create(completed: boolean): TaskCompleted {
    if (typeof completed !== 'boolean') {
      throw new Error('Task completed status must be a boolean value');
    }
    
    return new TaskCompleted(completed);
  }

  public static default(): TaskCompleted {
    return new TaskCompleted(false);
  }

  public getValue(): boolean {
    return this.value;
  }

  public isCompleted(): boolean {
    return this.value === true;
  }

  public toString(): string {
    return this.value.toString();
  }

  public equals(other: TaskCompleted): boolean {
    return this.value === other.value;
  }
}
