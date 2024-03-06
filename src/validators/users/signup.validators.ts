import { ValidateError } from 'errors/validate.error';
import { SignupRequest } from 'types/user.types';
import { Logger } from 'utilities/logger.util';
import { z } from 'zod';

export const signupValidator = async (request: SignupRequest): Promise<SignupRequest> => {
  try {
    const schema = z.object({ email: z.string(), password: z.string(), name: z.string() }).strict();

    const validated = await schema.parseAsync(request);

    return validated;
  } catch (error) {
    Logger.error('[SignUp] Request Validate Failed: %o', {
      error: error instanceof Error ? error : new Error(JSON.stringify(error)),
    });

    throw new ValidateError(
      '[SignUp] Validate Error',
      'Sign Up Validate Signup Request Error. Please Check Body Value Again.',
      error instanceof Error ? error : new Error(JSON.stringify(error)),
    );
  }
};
