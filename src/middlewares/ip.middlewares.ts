import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { apiLogger } from 'utilities/logger.util';

export const globalMiddleware = (request: Request, response: Response, next: NextFunction) => {
  Logger.debug('Received Request: %o', { origin: request.originalUrl });

  if (request.headers?.key === process.env.SESSION_SECRET!) {
    Logger.log('Auth Success');

    // Logger.debug("Request: %o", { request });
    // this.multer.single.(request, response, next);
    next();
  } else {
    Logger.log('Auth Failed');

    apiLogger.debug('Received Abnormal Request: %o', {
      body: request.body,
    });

    throw new HttpException('Header Authorization Key not Found', HttpStatus.BAD_REQUEST);
  }
};
