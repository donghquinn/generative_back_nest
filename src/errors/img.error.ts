export class ImageError extends Error {
  type: string;

  constructor(type: string, message: string, cause?: Error) {
    super(message);

    this.type = type;
    this.name = '[Image Error]';
    this.cause = cause;
  }
}
