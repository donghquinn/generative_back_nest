export class ChatError extends Error {
  type: string;

  constructor(type: string, message: string, cause?: Error) {
    super(message);

    this.type = type;

    this.name = 'Chat Error';

    this.cause = cause;
  }
}
