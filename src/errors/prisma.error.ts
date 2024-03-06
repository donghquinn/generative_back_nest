export class PrismaError extends Error {
  type: string;

  constructor(type: string, message: string, cause?: Error) {
    super(message);

    this.type = type;

    this.name = '[Prisma Error]';

    this.cause = cause;
  }
}
