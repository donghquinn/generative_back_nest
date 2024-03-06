import { ValidateError } from 'errors/zod.error';
import { SuperResolutionRequest } from 'types/resolution.types';
import { Logger } from 'utilities/logger.util';
import { z } from 'zod';

export const superResolutionValidator = async (request: SuperResolutionRequest) => {
  try {
    const scheme = z.object({
      email: z.string(),
      uuid: z.string(),
      fileName: z.string(),
      weights: z.string(),
      versionId: z.string(),
    });

    const validation = await scheme.parseAsync(request);

    return validation;
  } catch (error) {
    Logger.error('[SR] Super Resolution Validating Error: %o', {
      error: error instanceof Error ? error : new Error(JSON.stringify(error)),
    });

    throw new ValidateError(
      '[SR] Super Resolution Request Validation',
      'Super Resolution Requestion Validation Error: %o',
      error instanceof Error ? error : new Error(JSON.stringify(error)),
    );
  }
};
