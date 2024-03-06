import { Module } from '@nestjs/common';
import { MinioClient } from '@providers/common/minio.pvd';

@Module({
  providers: [MinioClient],
  exports: [MinioClient],
})
export class MinioModule {}
