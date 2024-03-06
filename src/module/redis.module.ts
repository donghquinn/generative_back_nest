import { Module } from '@nestjs/common';
import { RedisProvider } from '@providers/redis.pvd';

@Module({
  providers: [RedisProvider],
  exports: [RedisProvider],
})
export class RedisModule {}
