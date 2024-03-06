export class ResolutionError extends Error {
  type: string;

  constructor(type: string, message: string, cause?: Error) {
    super(message);

    this.type = type;

    this.name = '[Resolution Error]';

    this.cause = cause;
  }
}
