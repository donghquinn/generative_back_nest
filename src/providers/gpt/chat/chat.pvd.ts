import { ChatError } from '@errors/chat.error';
import { NoUserError } from '@errors/user.error';
import { Injectable, Logger } from '@nestjs/common';
import { OpenAiProvider } from '@providers/common/openai.pvd';
import { PrismaLibrary } from '@providers/common/prisma.pvd';
import { RedisProvider } from '@providers/redis.pvd';
import { ChatLogger } from '@utilities/logger.util';
import moment from 'moment-timezone';

// TODO WIP: Working On Text Generate
@Injectable()
export class GeneratePreTrainedTextChat {
  private now: string;

  constructor(
    private readonly prisma: PrismaLibrary,
    private readonly openai: OpenAiProvider,
    private readonly redis: RedisProvider,
  ) {
    this.now = moment.utc().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss');
  }

  async generateText(
    encodedEmail: string,
    model: string,
    content: string,
    num: string,
    name?: string,
    temperature?: number,
    topP?: number,
    stream?: boolean,
    stop?: string,
    maxTokens?: number,
    presencePenalty?: number,
    frequencyPenalty?: number,
    user?: string,
  ) {
    try {
      const isLogined = await this.redis.getItem(encodedEmail);

      if (isLogined === null) throw new NoUserError('[LOGIN] Login', 'No User Found');

      const { uuid } = isLogined;

      const messageArray: Array<string> = [];

      messageArray.length = 0;

      ChatLogger.info('Received Request: %o', { model, content, name });

      const completion = await this.openai.genereateText(
        model,
        content,
        num,
        temperature,
        topP,
        stop,
        maxTokens,
        presencePenalty,
        frequencyPenalty,
        user,
      );

      ChatLogger.debug('Chat Response: %o', {
        completion,
      });

      if (completion) {
        for (let i = 0; i < Number(num); i += 1) {
          ChatLogger.debug('Chat Response: %o', {
            response: completion.choices[i].message.content?.trim(),
          });

          await this.prisma.generatedChatInsert(
            uuid,
            model,
            content,
            num,
            this.now,
            messageArray,
            name,
            temperature,
            topP,
            stream,
            stop,
            presencePenalty,
            frequencyPenalty,
          );

          messageArray.push(completion.choices[i].message.content!.trim());
        }
      }

      ChatLogger.debug('Chat Completion Response: %o', { messageArray });
      Logger.debug('Chat Completion Response: %o', { messageArray });

      return messageArray;
    } catch (error) {
      ChatLogger.error('[Chat] Request Failed: %o', {
        error,
      });

      throw new ChatError(
        'Generate Chat',
        'Generate Chat Request Error',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }
}
// await GeneratePreTrainedTextChat
