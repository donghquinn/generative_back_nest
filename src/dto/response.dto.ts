import { AudioError } from '@errors/audio.error';
import { AuthError, NoValidateKeyError, PasswordError } from '@errors/auth.error';
import { ChatError } from '@errors/chat.error';
import { ImageError } from '@errors/img.error';
import { OpenAiError } from '@errors/openai.error';
import { PrismaError } from '@errors/prisma.error';
import { ResponseError } from '@errors/response.error';
import { NoUserError } from '@errors/user.error';
import { ValidateError } from '@errors/validate.error';
import { MulterError } from 'multer';
import { KeyableObject } from 'types/request.types';

export interface ResponseBody {
  resCode: string;
  dataRes: KeyableObject | null;
  errMsg: string[];
}

export class SetResponse implements ResponseBody {
  constructor(resCode: number, data?: KeyableObject) {
    this.resCode = resCode.toString();
    this.dataRes = data ?? null;
    this.errMsg = [];
  }
  resCode: string;
  dataRes: KeyableObject | null;
  errMsg: string[];
}

export class SetErrorResponse implements ResponseBody {
  resCode: string;

  dataRes: null;

  errMsg: string[];

  constructor(error: unknown) {
    const errorMessgaeArray = [];

    if (error instanceof AuthError) {
      this.resCode = '401';
      errorMessgaeArray.push(error.name, error.message);
    } else if (error instanceof ValidateError) {
      this.resCode = '402';
      errorMessgaeArray.push(error.name, error.message);
    } else if (error instanceof PrismaError) {
      this.resCode = '403';
      errorMessgaeArray.push(error.name, error.message);
    } else if (error instanceof MulterError) {
      this.resCode = '404';
      errorMessgaeArray.push(error.name, error.message);
    } else if (error instanceof ResponseError) {
      this.resCode = '405';
      errorMessgaeArray.push(error.name, error.message);
    } else if (error instanceof OpenAiError) {
      this.resCode = '406';
      errorMessgaeArray.push(error.name, error.message);
    } else if (error instanceof ImageError) {
      this.resCode = '407';
      errorMessgaeArray.push(error.type, error.message);
    } else if (error instanceof ChatError) {
      this.resCode = '408';
      errorMessgaeArray.push(error.type, error.message);
    } else if (error instanceof AudioError) {
      this.resCode = '409';
      errorMessgaeArray.push(error.type, error.message);
    } else if (error instanceof NoUserError) {
      this.resCode = '410';
      errorMessgaeArray.push(error.type, error.message);
    } else if (error instanceof NoValidateKeyError) {
      this.resCode = '411';
      errorMessgaeArray.push(error.type, error.message);
    } else if (error instanceof PasswordError) {
      this.resCode = '412';
      errorMessgaeArray.push(error.type, error.message);
    } else {
      this.resCode = '500';
      errorMessgaeArray.push(String(error));
    }

    this.dataRes = null;
    this.errMsg = errorMessgaeArray;
  }
}
