import { Module } from '@nestjs/common';
import { PrismaLibrary } from '@providers/common/prisma.pvd';
import { SrPrismaLibrary } from '@providers/common/srprisma.pvd';

@Module({
  providers: [SrPrismaLibrary, PrismaLibrary],
  exports: [SrPrismaLibrary],
})
export class SrPrismaModule {}
