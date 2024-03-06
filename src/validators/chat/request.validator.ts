import { ValidateError } from '@errors/validate.error';
import { Logger } from '@utilities/logger.util';
import { ChatRequest } from 'types/request.types';
import { z } from 'zod';

export const chatRequestValidator = async (request: ChatRequest) => {
  try {
    const schema = z
      .object({
        email: z.string(),
        model: z.string(),
        content: z.string(),
        number: z.string(),
        name: z.string().optional(),
        temperature: z.number().optional(),
        topP: z.number().optional(),
        stream: z.boolean().optional(),
        stop: z.string().optional(),
        maxTokens: z.number().optional(),
        presencePenalty: z.number().optional(),
        frequencePenalty: z.number().optional(),
        user: z.string().optional(),
      })
      .strict();

    const validated = await schema.parseAsync(request);

    return validated;
  } catch (error) {
    Logger.error(`[Validator] Chat Request Body Parsing Failed: ${JSON.stringify(error)}`);

    throw new ValidateError(
      'Validate Request',
      'Validate Error',
      error instanceof Error ? error : new Error(JSON.stringify(error)),
    );
  }
};
