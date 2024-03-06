import { ImageError } from 'errors/img.error';
import { ValidateError } from 'errors/validate.error';
import { ImageEditRequest } from 'types/request.types';
import { Logger } from 'utilities/logger.util';
import { z } from 'zod';

export const imageEditValidator = async (request: ImageEditRequest) => {
  try {
    const scheme = z.object({ image: z.unknown(), prompt: z.string(), number: z.string(), size: z.string() }).strict();

    const validated = await scheme.parseAsync(request);

    return validated;
  } catch (error) {
    Logger.error('[IMAGE] Image Edit Request Validate Failed: %o', {
      error: error instanceof Error ? error : new Error(JSON.stringify(error)),
    });

    throw new ValidateError(
      '[IMAGE] Validate Image Edit Request',
      'Validate Image Edit Request Error',
      error instanceof Error ? error : new Error(JSON.stringify(error)),
    );
  }
};
