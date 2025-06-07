export enum TaskPriorityValue {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export class TaskPriority {
  private readonly value: TaskPriorityValue;

  private constructor(priority: TaskPriorityValue) {
    this.value = priority;
  }

  public static create(priority: string): TaskPriority {
    if (!Object.values(TaskPriorityValue).includes(priority as TaskPriorityValue)) {
      throw new Error(`Invalid task priority: ${priority}`);
    }
    
    return new TaskPriority(priority as TaskPriorityValue);
  }

  public static default(): TaskPriority {
    return new TaskPriority(TaskPriorityValue.MEDIUM);
  }

  public getValue(): TaskPriorityValue {
    return this.value;
  }

  public equals(priority?: TaskPriority): boolean {
    if (priority === null || priority === undefined) {
      return false;
    }
    return this.value === priority.value;
  }

  public static LOW(): TaskPriority {
    return new TaskPriority(TaskPriorityValue.LOW);
  }

  public static MEDIUM(): TaskPriority {
    return new TaskPriority(TaskPriorityValue.MEDIUM);
  }

  public static HIGH(): TaskPriority {
    return new TaskPriority(TaskPriorityValue.HIGH);
  }
}