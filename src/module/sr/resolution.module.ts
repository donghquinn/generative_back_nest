import { Module } from '@nestjs/common';
import { MinioModule } from '../minio.module';
import { SrPrismaModule } from './srprisma.module';
import { SuperResolutionController } from '@controllers/sr/sr.ctl';
import { SuperResolutionProvider } from '@providers/sr/resolution.pvd';
import { RedisModule } from 'module/redis.module';

@Module({
  controllers: [SuperResolutionController],
  imports: [SrPrismaModule, MinioModule, RedisModule],
  providers: [SuperResolutionProvider],
})
export class SuperResolutionModule {}
