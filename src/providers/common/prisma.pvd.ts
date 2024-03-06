import { ImageError } from '@errors/img.error';
import { PrismaError } from '@errors/prisma.error';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { ImageLogger } from '@utilities/logger.util';
import { SizeTypes } from 'types/request.types';

@Injectable()
export class PrismaLibrary extends PrismaClient {
  async generatedChatInsert(
    clientUuid: string,
    model: string,
    content: string,
    num: string,
    now: string,
    messageArray: Array<string>,
    name?: string,
    temperature?: number,
    topP?: number,
    stream?: boolean,
    stop?: string,
    presencePenalty?: number,
    frequencyPenalty?: number,
  ): Promise<void> {
    try {
      await this.chatGen.create({
        data: {
          model,
          client_uuid: clientUuid,
          content,
          role: 'user',
          response: messageArray,
          name,
          temperature,
          topP,
          number: Number(num),
          stream,
          stop,
          presencePenalty,
          frequencyPenalty,
          created: now,
        },
      });
    } catch (error) {
      ImageLogger.error(`[CHAT] Insert Generated Chat Error: %o`, {
        error,
      });

      throw new PrismaError(
        '[CHAT] Insert Generated Chat',
        'Insert Generated Chat Error',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async insertImageData(
    clientUuid: string,
    prompt: string,
    number: string,
    imageUrl: string,
    now: string,
    size?: SizeTypes,
  ): Promise<void> {
    try {
      await this.imageGen.create({
        data: {
          client_uuid: clientUuid,
          prompt,
          number: Number(number),
          size,
          img: imageUrl,
          created: now,
        },
      });
    } catch (error) {
      ImageLogger.error(`[IMAGE] Insert Genereate Image Info Error: %o`, {
        error,
      });

      throw new PrismaError(
        '[IMAGE] Insert Genereate Image Info',
        'Insert Genereate Image Info Error. Please Try Again.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }
}
