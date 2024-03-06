import { Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { PrismaLibrary } from '@providers/common/prisma.pvd';

export function shutdown(server: NestExpressApplication) {
  const prisma = new PrismaLibrary();

  try {
    prisma.$disconnect();
    server.close();

    Logger.log('[SYSTEM] GraceFul ShutDown');

    process.exitCode = 0;
  } catch (error) {
    Logger.error('[PROCESS_ERROR] Error Occured While Gracefully Stop');
    Logger.error('%o', error);

    process.exitCode = 1;
  }
}
