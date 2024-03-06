export class MinioError extends Error {
  type: string;

  constructor(type: string, message: string, cause?: Error) {
    super(message);

    this.type = type;

    this.name = '[Minio Error]';

    this.cause = cause;
  }
}
