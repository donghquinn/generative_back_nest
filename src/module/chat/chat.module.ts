import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma.module';
import { ChatController } from '@controllers/gpt/chat/chat.ctl';
import { GeneratePreTrainedTextChat } from '@providers/gpt/chat/chat.pvd';
import { OpenAiModule } from '../openai.module';
import { RedisModule } from '../redis.module';

@Module({
  controllers: [ChatController],
  imports: [PrismaModule, OpenAiModule, RedisModule],
  providers: [GeneratePreTrainedTextChat],
})
export class ChatModule {}
