export class Web3Error extends Error {
  type: string;

  constructor(type: string, message: string, cause?: Error) {
    super(message);

    this.type = type;
    this.name = '[Web3 Error]';
    this.cause = cause;
  }
}
