import { ValidateError } from 'errors/validate.error';
import { LoginRequest, LogoutRequest } from 'types/user.types';
import { Logger } from 'utilities/logger.util';
import { z } from 'zod';

export const loginRequestValidator = async (request: LoginRequest) => {
  try {
    const scheme = z.object({ email: z.string(), password: z.string() });

    const validated = await scheme.parseAsync(request);

    return validated;
  } catch (error) {
    Logger.error('[LOGIN] Request Validate Failed: %o', {
      error: error instanceof Error ? error : new Error(JSON.stringify(error)),
    });

    throw new ValidateError(
      '[Login] Request Validate',
      'Login Request Validate Failed. Please Check Request Body Again.',
      error instanceof Error ? error : new Error(JSON.stringify(error)),
    );
  }
};
