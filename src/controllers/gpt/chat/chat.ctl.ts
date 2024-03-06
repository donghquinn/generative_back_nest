import { Body, Controller, Logger, Post } from '@nestjs/common';
import { GeneratePreTrainedTextChat } from '@providers/gpt/chat/chat.pvd';
import { SetErrorResponse, SetResponse } from 'dto/response.dto';
import { ChatRequest } from 'types/request.types';
import { chatRequestValidator } from '@validators/chat/request.validator';
@Controller('chat')
export class ChatController {
  constructor(private readonly chat: GeneratePreTrainedTextChat) {}

  @Post('/generate')
  async chatGenerateController(@Body() request: ChatRequest) {
    try {
      Logger.debug('Received Chat Request: %o', { request });

      const {
        email,
        model,
        content,
        name,
        temperature,
        topP,
        number,
        stream,
        stop,
        maxTokens,
        presencePenalty,
        frequencePenalty,
        user,
      } = await chatRequestValidator(request);

      const result = await this.chat.generateText(
        email,
        model,
        content,
        number,
        name,
        temperature,
        topP,
        stream,
        stop,
        maxTokens,
        presencePenalty,
        frequencePenalty,
        user,
      );

      return new SetResponse(200, { result });
    } catch (error) {
      return new SetErrorResponse(error);
    }
  }
}
