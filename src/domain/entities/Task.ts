import { TaskId } from '../value-objects/TaskId';
import { TaskTitle } from '../value-objects/TaskTitle';
import { TaskCompleted } from '../value-objects/TaskCompleted';
import { TaskPriority, TaskPriorityValue } from '../value-objects/TaskPriority';

export interface TaskProps {
  id: TaskId;
  title: TaskTitle;
  description: string;
  completed: TaskCompleted;
  priority: TaskPriority;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export class Task {
  private readonly id: TaskId;
  private title: TaskTitle;
  private description: string;
  private completed: TaskCompleted;
  private priority: TaskPriority;
  private readonly userId: string;
  private readonly createdAt: Date;
  private updatedAt: Date;
  private completedAt?: Date;

  private constructor(props: TaskProps) {
    this.id = props.id;
    this.title = props.title;
    this.description = props.description;
    this.completed = props.completed;
    this.priority = props.priority;
    this.userId = props.userId;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.completedAt = props.completedAt;
  }

  public static create(
    title: string,
    description: string,
    userId: string,
    priority?: string,
    completed?: boolean,
    id?: string
  ): Task {
    const taskId = id ? TaskId.fromExisting(id) : TaskId.create();
    const taskTitle = TaskTitle.create(title);
    const taskCompleted = completed !== undefined 
      ? TaskCompleted.create(completed) 
      : TaskCompleted.default();
    const taskPriority = priority 
      ? TaskPriority.create(priority) 
      : TaskPriority.default();
    
    const now = new Date();

    return new Task({
      id: taskId,
      title: taskTitle,
      description,
      completed: taskCompleted,
      priority: taskPriority,
      userId,
      createdAt: now,
      updatedAt: now
    });
  }

  public static reconstitute(props: {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    priority: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    completedAt?: Date;
  }): Task {
    return new Task({
      id: TaskId.fromExisting(props.id),
      title: TaskTitle.create(props.title),
      description: props.description,
      completed: TaskCompleted.create(props.completed),
      priority: TaskPriority.create(props.priority),
      userId: props.userId,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
      completedAt: props.completedAt
    });
  }

  public getId(): string {
    return this.id.getValue();
  }

  public getTitle(): string {
    return this.title.getValue();
  }

  public getDescription(): string {
    return this.description;
  }

  public getCompleted(): boolean {
    return this.completed.getValue();
  }

  public isCompleted(): boolean {
    return this.completed.isCompleted();
  }

  public getPriority(): TaskPriorityValue {
    return this.priority.getValue();
  }

  public getCreatedAt(): Date {
    return this.createdAt;
  }

  public getUpdatedAt(): Date {
    return this.updatedAt;
  }

  public getCompletedAt(): Date | undefined {
    return this.completedAt;
  }

  public getUserId(): string {
    return this.userId;
  }

  public updateTitle(title: string): void {
    this.title = TaskTitle.create(title);
    this.updatedAt = new Date();
  }

  public updateDescription(description: string): void {
    this.description = description;
    this.updatedAt = new Date();
  }

  public updateCompleted(completed: boolean): void {
    const newCompleted = TaskCompleted.create(completed);
    
    // If transitioning to completed, set the completedAt date
    if (completed && !this.completed.isCompleted()) {
      this.completedAt = new Date();
    }
    
    // If transitioning from completed to not completed, remove the completedAt date
    if (!completed && this.completed.isCompleted()) {
      this.completedAt = undefined;
    }
    
    this.completed = newCompleted;
    this.updatedAt = new Date();
  }

  public updatePriority(priority: string): void {
    this.priority = TaskPriority.create(priority);
    this.updatedAt = new Date();
  }

  public toJSON(): any {
    return {
      id: this.getId(),
      title: this.getTitle(),
      description: this.getDescription(),
      completed: this.getCompleted(),
      priority: this.getPriority(),
      userId: this.getUserId(),
      createdAt: this.getCreatedAt(),
      updatedAt: this.getUpdatedAt(),
      completedAt: this.getCompletedAt()
    };
  }
}