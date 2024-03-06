import { AudioController } from '@controllers/audio/song.ctl';
import { Module } from '@nestjs/common';
import { AudioProvider } from '@providers/audio/song.pvd';
import { PrismaModule } from '../prisma.module';
import { MinioModule } from '../minio.module';
import { RedisModule } from '../redis.module';

@Module({
  providers: [AudioProvider],
  controllers: [AudioController],
  imports: [PrismaModule, MinioModule, RedisModule],
})
export class AudioModule {}
