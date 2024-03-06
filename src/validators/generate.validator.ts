import { ValidateError } from 'errors/validate.error';
import { Logger } from 'utilities/logger.util';
import { z } from 'zod';

export const tokenAndUrlValidator = async (token: string | undefined, url: string | undefined) => {
  try {
    const scheme = z.object({ token: z.string(), url: z.string() }).strict();

    const validated = await scheme.parseAsync({ token, url });

    return validated;
  } catch (error) {
    Logger.error(`[Validator] Token And Url Parsing Failed: ${JSON.stringify(error)}`);

    throw new ValidateError(
      '[GENERATER] Token And Url Parsing Failed',
      'Generate Request Token and URL Parsing Error: %o',
      error instanceof Error ? error : new Error(JSON.stringify(error)),
    );
  }
};
