export enum TaskStatusValue {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE'
}

export class TaskStatus {
  private readonly value: TaskStatusValue;

  private constructor(status: TaskStatusValue) {
    this.value = status;
  }

  public static create(status: string): TaskStatus {
    if (!Object.values(TaskStatusValue).includes(status as TaskStatusValue)) {
      throw new Error(`Invalid task status: ${status}`);
    }
    
    return new TaskStatus(status as TaskStatusValue);
  }

  public static default(): TaskStatus {
    return new TaskStatus(TaskStatusValue.TODO);
  }

  public getValue(): TaskStatusValue {
    return this.value;
  }

  public equals(status?: TaskStatus): boolean {
    if (status === null || status === undefined) {
      return false;
    }
    return this.value === status.value;
  }

  public static TODO(): TaskStatus {
    return new TaskStatus(TaskStatusValue.TODO);
  }

  public static IN_PROGRESS(): TaskStatus {
    return new TaskStatus(TaskStatusValue.IN_PROGRESS);
  }

  public static DONE(): TaskStatus {
    return new TaskStatus(TaskStatusValue.DONE);
  }
}