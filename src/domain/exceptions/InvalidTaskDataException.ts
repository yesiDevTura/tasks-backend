export class InvalidTaskDataException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidTaskDataException';
  }
}