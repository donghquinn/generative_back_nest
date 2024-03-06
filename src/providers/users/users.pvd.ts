import { NoValidateKeyError, PasswordError } from '@errors/auth.error';
import { comparePassword, decrypt } from '@libraries/crypto/decrypt.lib';
import { cryptData } from '@libraries/crypto/encrypt.lib';
import { Injectable } from '@nestjs/common';
import { MailerProvider } from '@providers/mailer.pvd';
import { RedisProvider } from '@providers/redis.pvd';
import { randomBytes } from 'crypto';
import { NoUserError, UserError } from 'errors/user.error';
import { UserLogger } from 'utilities/logger.util';
import { ClientPrismaLibrary } from './client-prisma.pvd';
import { createSearchPasswordMailcontent } from '@utilities/mail.utils';

@Injectable()
export class UserProvider {
  constructor(
    private readonly prisma: ClientPrismaLibrary,
    private readonly redis: RedisProvider,
    private readonly mailer: MailerProvider,
  ) {}

  /**
   *
   * @param email 사용할 사용자 email
   * @param name 사용자 이름
   * @param password 사용자 패스워드
   * @returns 성공 여부
   */
  async checkExistingEmailAndCreateUser(email: string, name: string, password: string) {
    try {
      UserLogger.info('[SIGNIN] Received Request: %o', {
        email,
        name,
        password,
      });

      const isExist = await this.prisma.checkIsEmailExist(email);

      UserLogger.debug('[SIGNIN] Is Exsiting Email: %o', { isExist });

      if (!isExist) {
        UserLogger.error('[SIGNIN] Already Registered Email: %o', {
          email,
          name,
        });

        throw new NoUserError('[SIGNIN] Sign in Check Email Exists', 'Already Registered Email');
      }

      UserLogger.debug('[SIGNIN] Create data Start');

      const { encodedData: encodedPassword, encodedToken } = cryptData(password);

      await this.prisma.insertNewClient(email, name, encodedPassword, encodedToken);

      UserLogger.info('[SIGNIN] Data Insert Success');

      return 'Success';
    } catch (error) {
      UserLogger.error('[SIGNIN] Signin Error: %o', {
        error,
      });

      throw new UserError(
        '[SIGNIN]',
        'Existing Email Check Error',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async login(email: string, password: string) {
    try {
      UserLogger.info('[LOGIN] Received Login Request: %o', { email });
      const { encodedData: encodedEmail, encodedToken: emailToken } = cryptData(email);

      const isLogined = await this.redis.getItem(encodedEmail);
      // 받아온 패스워드를 회원 등록할때 인코딩 방식 그대로 인코딩

      if (isLogined) throw new NoUserError('[LOGIN] Login', 'User is Already Logined');

      // 찾기
      const result = await this.prisma.selectUserInfo(email);

      if (result === null) {
        UserLogger.error('[LOGIN] Error. No matching User Found.: %o', {
          email,
        });

        throw new NoUserError('[LOGIN] Login', 'No Matching Info. Please Make sure you Logged Out Before.');
      }

      const { uuid, password: dbPassword, token: passwordToken } = result;

      const isMatch = comparePassword(password, dbPassword, passwordToken);

      if (!isMatch) throw new PasswordError('[LOGIN] Matching Password', 'Password is Not Match');

      await this.redis.setItem(encodedEmail, emailToken, uuid, dbPassword);

      return encodedEmail;
    } catch (error) {
      UserLogger.error('[LOGIN] Login Error: %o', {
        error,
      });

      throw new UserError(
        '[LOGIN] Login Request',
        'Login Request Error',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async logout(encodedEmail: string) {
    try {
      const isLogin = await this.redis.getItem(encodedEmail);

      if (isLogin === null) throw new NoUserError('[LOGOUT] Logout', 'No Logined User');

      const { token } = isLogin;

      const email = decrypt(encodedEmail, token);

      // 찾기
      const result = await this.prisma.selectUserInfo(email);

      if (result === null) {
        UserLogger.error('[LOGOUT] Error. No matching User Found.: %o', {
          email,
        });

        throw new UserError('[LOGOUT] Log out', 'No Matching Info');
      }

      // JWT 토큰 리턴
      await this.redis.deleteItem(encodedEmail);

      return 'logout';
    } catch (error) {
      UserLogger.error('[LOGOUT] LOGOUT Error: %o', {
        error,
      });

      throw new UserError(
        '[LOGOUT]',
        'LOGOUT Error',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async searchPassword(email: string, name: string) {
    try {
      // 찾기
      const result = await this.prisma.selectUserInfo(email, name);

      if (result === null) throw new NoUserError('[SEARCH_PASS] Search Password', 'No User Found');

      const randomKey = randomBytes(8).toString('hex');
      // const { encodedData: encodedPassword, dataToken: passwordToken } = cryptData(randomPassword);

      const mailContent = createSearchPasswordMailcontent(randomKey);

      const { password, token: token } = result;

      await this.redis.setTempData(randomKey, email, password, token);

      await this.mailer.sendMail(email, 'Search Password', mailContent);

      UserLogger.debug('[SEARCH_PASS] Sent New Password Complete');

      return 'Sent';
    } catch (error) {
      UserLogger.error('[SEARCH_PASS] Search Password Error: %o', {
        error,
      });

      throw new UserError(
        '[SEARCH_PASS] Search Password',
        'Search Password Error',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async validateSearchingPasswordKey(tempKey: string) {
    try {
      // 찾기
      const tempItem = await this.redis.getTempData(tempKey);

      if (tempItem === null)
        throw new NoValidateKeyError('[VALIDATE_KEY] Validate Password Searching Key', 'No Matching Key Found');

      const { password, token } = tempItem;

      const rawPassword = decrypt(password, token);

      UserLogger.debug('[VALIDATE_KEY] Validate Password Searching Key Complete');

      return rawPassword;
    } catch (error) {
      UserLogger.error('[VALIDATE_KEY] Validate Password Searching Key Error: %o', {
        error,
      });

      throw new UserError(
        '[VALIDATE_KEY] Validate Password Searching Key',
        'Validate Password Searching Key Error',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async searchEmail(name: string) {
    try {
      const result = await this.prisma.findEmail(name);

      if (result === null) throw new NoUserError('[SEARCH_EMAIL] Find Email', 'No Matching Data Found');

      const { email } = result;

      UserLogger.debug('[SEARCH_EMAIL] Finding Email Complete');

      return email;
    } catch (error) {
      UserLogger.error('[SEARCH_EMAIL] Finding Email Error: %o', {
        error,
      });

      throw new UserError(
        '[SEARCH_EMAIL] Finding Email',
        'Finding Email Error',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async changePassword(encodedEmail: string, password: string, newPassword: string) {
    try {
      const loginInfo = await this.redis.getItem(encodedEmail);

      if (loginInfo === null) throw new NoUserError('[CHANGE_PASS] Change Password', 'No User Data Found');

      const { token: redisToken } = loginInfo;

      const email = decrypt(encodedEmail, redisToken);

      // 찾기
      const result = await this.prisma.selectUserInfo(email);

      if (result === null) {
        UserLogger.error('[CHANGE_PASS] Error. No matching User Found.: %o', {
          email,
        });

        throw new NoUserError('[CHANGE_PASS] Login', 'No Matching Info. Please Make sure you Logged Out Before.');
      }

      const { password: dbPassword, token: token, uuid } = result;

      const isMatch = comparePassword(password, dbPassword, token);

      if (!isMatch) throw new PasswordError('[CHANGE_PASS] Changing Password', 'Password Is Not Match');

      const { encodedData: encodedPassword, encodedToken: passwordToken } = cryptData(newPassword);

      await this.prisma.updateNewPassword(uuid, encodedPassword, passwordToken);

      UserLogger.debug('[CHANGE_PASS] Changing Password Complete');

      return 'success';
    } catch (error) {
      UserLogger.error('[CHANGE_PASS] Change Password Error: %o', {
        error,
      });

      throw new UserError(
        '[CHANGE_PASS] Change Password',
        'Change Password Error',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }
}
