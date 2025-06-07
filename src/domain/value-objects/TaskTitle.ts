export class TaskTitle {
  private readonly value: string;

  private constructor(title: string) {
    this.value = title;
  }

  public static create(title: string): TaskTitle {
    if (!title || title.trim().length === 0) {
      throw new Error('Task title cannot be empty');
    }

    if (title.length > 100) {
      throw new Error('Task title cannot be longer than 100 characters');
    }

    return new TaskTitle(title.trim());
  }

  public getValue(): string {
    return this.value;
  }

  public equals(title?: TaskTitle): boolean {
    if (title === null || title === undefined) {
      return false;
    }
    return this.value === title.value;
  }
}