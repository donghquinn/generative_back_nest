export class UserError extends Error {
  type: string;

  constructor(type: string, message: string, cause?: Error) {
    super(message);

    this.type = type;

    this.name = 'User Error';

    this.cause = cause;
  }
}

export class NoUserError extends Error {
  type: string;

  constructor(type: string, message: string, cause?: Error) {
    super(message);

    this.name = '[No User Error]';

    this.type = type;

    this.cause = cause;
  }
}
