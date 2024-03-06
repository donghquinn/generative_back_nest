import { Module } from '@nestjs/common';
import { ClientPrismaLibrary } from '@providers/users/client-prisma.pvd';

@Module({
  providers: [ClientPrismaLibrary],
  exports: [ClientPrismaLibrary],
})
export class UserPrismaModule {}
