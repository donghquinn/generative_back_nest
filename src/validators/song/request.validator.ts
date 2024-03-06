import { ValidateError } from '@errors/validate.error';
import { Logger } from '@utilities/logger.util';
import { SongGenerateRequest } from 'types/audio/song.type';
import { z } from 'zod';

export const songGenerateValidator = async (request: SongGenerateRequest) => {
  try {
    const scheme = z.object({
      email: z.string(),
      select: z.string(),
      lyric: z.string().optional(),
      emotion: z.string().optional(),
    });

    const parsed = await scheme.parseAsync(request);

    return parsed;
  } catch (error) {
    Logger.error('[SONG] Generate Song Validation Error: %o', {
      request,
      error: error instanceof Error ? error : new Error(JSON.stringify(error)),
    });

    throw new ValidateError(
      '[SONG] Generate Song',
      'Generate Song Validation Error. Please Try Again.',
      error instanceof Error ? error : new Error(JSON.stringify(error)),
    );
  }
};
