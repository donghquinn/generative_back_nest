import { Logger } from '@utilities/logger.util';
import { ValidateError } from 'errors/validate.error';
import { Formats, ImageRequestTypes, SizeTypes, TranslateRequestTypes } from 'types/request.types';
import { z } from 'zod';

export const imageGenerateValidator = async (request: ImageRequestTypes) => {
  try {
    //
    const scheme = z
      .object({
        email: z.string(),
        prompt: z.string(),
        number: z.string(),
        size: z.custom<SizeTypes>().optional(),
        responseFormat: z.custom<Formats>().optional(),
        user: z.string().optional(),
      })
      .strict();

    const validate = await scheme.parseAsync(request);

    return validate;
  } catch (error) {
    Logger.error('[IMAGE] Image Generate Request Validator Error: %o', {
      error: error instanceof Error ? error : new Error(JSON.stringify(error)),
    });

    throw new ValidateError(
      '[IMAGE] Generate Image Request',
      'Image Generate Request Validator Error. Please Check the prompt.',
      error instanceof Error ? error : new Error(JSON.stringify(error)),
    );
  }
};

export const translateValidator = async (request: TranslateRequestTypes) => {
  try {
    const scheme = z
      .object({
        file: z.string(),
        targetLanguage: z.string(),
        prompt: z.string().optional(),
        temperature: z.number().optional(),
        response_format: z.string().optional(),
      })
      .strict();

    const validate = await scheme.parseAsync(request);

    return validate;
  } catch (error) {
    Logger.error(`[Validator] Translation Request Body Parsing Failed: ${JSON.stringify(error)}`);

    throw new Error(`[Validator] Translation Request Body Parsing Failed: ${JSON.stringify(error)}`);
  }
};
