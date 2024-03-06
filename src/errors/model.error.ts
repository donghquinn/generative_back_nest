export class ModelError extends Error {
  type: string;

  constructor(type: string, message: string, cause?: Error) {
    super(message);

    this.type = type;
    this.name = '[Model Error]';
    this.cause = cause;
  }
}
