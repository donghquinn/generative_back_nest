import { UserError } from '@errors/user.error';
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { UserLogger } from '@utilities/logger.util';

@Injectable()
export class ClientPrismaLibrary extends PrismaClient {
  async checkIsEmailExist(email: string) {
    try {
      const result = await this.client.findFirst({
        select: {
          uuid: true,
        },
        where: { email },
      });

      if (result !== null)
        throw new UserError('[Signup] Check is Exist in Email', 'Found Existing Email. Please try different email');

      UserLogger.debug('[Signup] No Email Found. Good to go: %o', {
        email,
      });

      return true;
    } catch (error) {
      UserLogger.error('[Signup] Check is existing email: %o', {
        error,
      });

      throw new UserError(
        '[Signup] Check is Existing Email',
        'Check is Existing Email Error. Please Check Again.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async insertNewClient(email: string, name: string, encodedPassword: string, passwordToken: string) {
    try {
      const { uuid } = await this.client.create({
        data: {
          email,
          name,
          password: encodedPassword,
          token: passwordToken,
        },
      });

      return uuid;
    } catch (error) {
      UserLogger.error('[Signup] Check is existing email: %o', {
        error,
      });

      throw new UserError(
        '[Signup] Check is Existing Email',
        'Check is Existing Email Error. Please Check Again.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async selectUserInfo(email: string, name?: string) {
    try {
      const userInfo = await this.client.findFirst({
        select: {
          uuid: true,
          token: true,
          password: true,
        },
        where: {
          email,
          name,
        },
      });

      return userInfo;
    } catch (error) {
      UserLogger.error('[Signup] Check is existing email: %o', {
        error,
      });

      throw new UserError(
        '[Signup] Check is Existing Email',
        'Check is Existing Email Error. Please Check Again.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async selectUserInfoByUuid(clientUuid: string) {
    try {
      const userInfo = await this.client.findFirst({
        select: {
          uuid: true,
          token: true,
          password: true,
        },
        where: {
          uuid: clientUuid,
        },
      });
      return userInfo;
    } catch (error) {
      UserLogger.error('[LOGOUT] Check is existing email: %o', {
        error,
      });

      throw new UserError(
        '[LOGOUT] Check is Existing Email',
        'Check is Existing Email Error. Please Check Again.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async updateClientLoginStatus(email: string, clientUuid: string, isLogined: boolean) {
    try {
      await this.client.update({
        data: {
          isLogin: isLogined,
        },
        where: {
          email,
          uuid: clientUuid,
        },
      });
    } catch (error) {
      UserLogger.error('[STATUS] User Status Update: %o', {
        error,
      });

      throw new UserError(
        '[STATUS] User Status Update',
        'User Status Update Error. Please Check Again.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async getMyPageInfo(email: string, clientUuid: string) {
    try {
      const result = await this.client.findFirst({
        select: {
          email: true,
          name: true,
          password: true,
          token: true,
          profileImage: true,
        },
        where: {
          email,
          uuid: clientUuid,
        },
      });

      if (result === null) throw new UserError('[MYPAGE] Get My Page', 'No User Found');

      return result;
    } catch (error) {
      throw new UserError('[MYPAGE] Get My Page', 'Get My Page Error.');
    }
  }

  async findEmail(name: string) {
    try {
      const result = await this.client.findFirst({
        select: {
          email: true,
        },
        where: {
          name,
        },
      });

      return result;
    } catch (error) {
      UserLogger.error('[CHANGE_PASS] Update New Password Error: %o', {
        error,
      });

      throw new UserError(
        '[CHANGE_PASS] Update New Password',
        'Update New Password Error',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async updateNewPassword(userUuid: string, newEncodedPassword: string, newEncodedToken: string) {
    try {
      await this.client.update({
        data: {
          password: newEncodedPassword,
          token: newEncodedToken,
        },
        where: {
          uuid: userUuid,
        },
      });
    } catch (error) {
      UserLogger.error('[CHANGE_PASS] Update New Password Error: %o', {
        error,
      });

      throw new UserError(
        '[CHANGE_PASS] Update New Password',
        'Update New Password Error',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }
}
