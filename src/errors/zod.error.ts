export class ValidateError extends Error {
  type: string;

  constructor(type: string, message: string, cause?: Error) {
    super(message);

    this.type = type;

    this.name = '[Validate Error]';

    this.cause = cause;
  }
}
