import { Module } from '@nestjs/common';
import { MinioModule } from '../minio.module';
import { PrismaModule } from '../prisma.module';
import { GenerateImageProvider } from '@providers/gpt/img/getImages.pvd';
import { ImageController } from '@controllers/gpt/img/generate';
import { OpenAiModule } from '../openai.module';
import { RedisModule } from 'module/redis.module';

@Module({
  providers: [GenerateImageProvider],
  imports: [PrismaModule, MinioModule, OpenAiModule, RedisModule],
  controllers: [ImageController],
})
export class ImageModule {}
