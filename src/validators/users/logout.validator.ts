import { ValidateError } from 'errors/validate.error';
import { LogoutRequest } from 'types/user.types';
import { Logger } from 'utilities/logger.util';
import { z } from 'zod';

export const logoutRequestValidator = async (request: LogoutRequest) => {
  try {
    const scheme = z.object({ userUuid: z.string() });

    const validated = await scheme.parseAsync(request);

    return validated;
  } catch (error) {
    Logger.error('[LOGOUT] Request Validate Failed: %o', {
      error: error instanceof Error ? error : new Error(JSON.stringify(error)),
    });

    throw new ValidateError(
      '[Logout] Request Validate',
      'Logout Request Validate Failed. Please Check Request Body Again.',
      error instanceof Error ? error : new Error(JSON.stringify(error)),
    );
  }
};
