export class AudioError extends Error {
  type: string;

  constructor(type: string, message: string, cause?: Error) {
    super(message);

    this.type = type;

    this.name = '[Audio Error]';

    this.cause = cause;
  }
}
