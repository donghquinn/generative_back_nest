import { Module } from '@nestjs/common';
import { OpenAiProvider } from '@providers/common/openai.pvd';

@Module({
  providers: [OpenAiProvider],
  exports: [OpenAiProvider],
})
export class OpenAiModule {}
