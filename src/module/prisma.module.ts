import { Module } from '@nestjs/common';
import { PrismaLibrary } from '@providers/common/prisma.pvd';

@Module({
  providers: [PrismaLibrary],
  exports: [PrismaLibrary],
})
export class PrismaModule {}
