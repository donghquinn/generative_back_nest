import { Module } from '@nestjs/common';
import { UserProvider } from '@providers/users/users.pvd';
import { userController } from 'controllers/users/create.ctl';
import { RedisModule } from '../redis.module';
import { UserPrismaModule } from './user-prisma.module';
import { MailerModule } from 'module/mailer.module';

@Module({
  providers: [UserProvider],
  imports: [RedisModule, UserPrismaModule, MailerModule],
  controllers: [userController],
})
export class UserModule {}
