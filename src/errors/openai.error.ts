export class OpenAiError extends Error {
  type: string;

  constructor(type: string, message: string, cause?: Error) {
    super(message);

    this.type = type;
    this.name = '[OpenAI Error]';
    this.cause = cause;
  }
}
