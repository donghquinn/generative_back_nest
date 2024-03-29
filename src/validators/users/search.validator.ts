import { ValidateError } from '@errors/validate.error';
import { Logger } from '@utilities/logger.util';
import { SearchEmailRequest, SearchPasswordRequest, ValidatePasswordKeyRequest } from 'types/user.types';
import { z } from 'zod';

export const searchEmailRequestValidator = async (request: SearchEmailRequest) => {
  try {
    const scheme = z.object({ name: z.string() });

    const parse = await scheme.parseAsync(request);

    return parse;
  } catch (error) {
    Logger.error('[SEARCH_EMAIL] Search Email Validator Error: %o', {
      request,
      error: error instanceof Error ? error : new Error(JSON.stringify(error)),
    });

    throw new ValidateError(
      '[SEARCH_EMAIL] Search Email Error',
      'Search Email Validator Error',
      error instanceof Error ? error : new Error(JSON.stringify(error)),
    );
  }
};

export const searchPasswordRequestValidator = async (request: SearchPasswordRequest) => {
  try {
    const scheme = z.object({ email: z.string(), name: z.string() });

    const parse = await scheme.parseAsync(request);

    return parse;
  } catch (error) {
    Logger.error('[SEARCH_PASS] Search Password Validator Error: %o', {
      request,
      error: error instanceof Error ? error : new Error(JSON.stringify(error)),
    });

    throw new ValidateError(
      '[SEARCH_PASS] Search Password Error',
      'Search Password Validator Error',
      error instanceof Error ? error : new Error(JSON.stringify(error)),
    );
  }
};

export const validatePasswordTempKeyRequestValidator = async (request: ValidatePasswordKeyRequest) => {
  try {
    const scheme = z.object({ tempKey: z.string() });

    const parse = await scheme.parseAsync(request);

    return parse;
  } catch (error) {
    Logger.error('[VALIDATE_KEY] Password Searching Key Validator Error: %o', {
      request,
      error: error instanceof Error ? error : new Error(JSON.stringify(error)),
    });

    throw new ValidateError(
      '[VALIDATE_KEY] Validate Password Searching Key Error',
      'Search Password Validator Error',
      error instanceof Error ? error : new Error(JSON.stringify(error)),
    );
  }
};
