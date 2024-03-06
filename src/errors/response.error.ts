export class ResponseError extends Error {
  type: string;

  constructor(type: string, message: string, cause?: Error) {
    super(message);

    this.type = type;

    this.name = 'Response Error';

    this.cause = cause;
  }
}
