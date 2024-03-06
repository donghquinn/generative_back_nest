import { ChatError } from '@errors/chat.error';
import { OpenAiError } from '@errors/openai.error';
import { ResponseError } from '@errors/response.error';
import { Injectable } from '@nestjs/common';
import { ChatLogger, ImageLogger } from '@utilities/logger.util';
import OpenAI, { OpenAIError } from 'openai';
import { ImageResponseFormat } from 'types/img.type';
import { SizeTypes } from 'types/request.types';

@Injectable()
export class OpenAiProvider extends OpenAI {
  constructor() {
    super({ apiKey: process.env.CHATGPT_API_TOKEN });
  }

  async genereateText(
    model: string,
    content: string,
    num: string,
    temperature?: number,
    topP?: number,
    stop?: string,
    maxTokens?: number,
    presencePenalty?: number,
    frequencyPenalty?: number,
    user?: string,
  ) {
    try {
      const completion = await this.chat.completions.create({
        model,
        messages: [{ role: 'user', content }],
        temperature,
        top_p: topP,
        n: Number(num),
        stream: false,
        stop,
        max_tokens: maxTokens,
        presence_penalty: presencePenalty,
        frequency_penalty: frequencyPenalty,
        user,
      });

      return completion;
    } catch (error) {
      if (error instanceof OpenAIError) {
        ChatLogger.error('[Chat] Failed to Get Chat Response: %o', {
          message: error.message,
          cause: error.cause,
        });

        throw new ChatError(
          '[Chat] Generate Chat',
          'Generate Chat Request Error',
          error instanceof Error ? error : new Error(JSON.stringify(error)),
        );
      }
      ChatLogger.error('[Chat] Request Failed: %o', {
        error,
      });

      throw new OpenAiError(
        '[CHAT] Genereate Chat',
        'Genereate Chat Error. Please Try Again.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async genereateImage(
    prompt: string,
    number: string,
    size?: SizeTypes,
    responseFormat?: ImageResponseFormat,
    user?: string,
  ) {
    try {
      const response = await this.images.generate({
        prompt,
        n: Number(number),
        size,
        response_format: responseFormat,
        user,
      });

      return response;
    } catch (error) {
      if (error instanceof OpenAIError) {
        ImageLogger.error('[IMAGE] Image Generate Failed. Arrived at Usage Limit: %o', {
          message: error.message,
          cause: error.cause,
        });

        throw new ResponseError('[IMAGE] Image Generate', 'Image Generate Failed', new Error('Rate Limit'));
      }

      ChatLogger.error('[IMAGE] Request Failed: %o', {
        error,
      });

      throw new OpenAiError(
        '[IMAGE] Genereate Chat',
        'Genereate Chat Error. Please Try Again.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }
}
