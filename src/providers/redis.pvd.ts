import { RedisError } from '@errors/redis.error';
import { Injectable } from '@nestjs/common';
import { RedisLogger } from '@utilities/logger.util';
import { RedisClientType, createClient } from 'redis';
import { ClientLoginItem, ValidateKeyItem } from 'types/user.types';

@Injectable()
export class RedisProvider {
  private redis: RedisClientType;

  private keyList: Array<string>;
  constructor() {
    this.redis = createClient({
      url: process.env.REDIS_HOST,
      username: process.env.REDIS_USER,
      password: process.env.REIDS_PASS,
    });

    this.keyList = [];
  }

  public async start() {
    try {
      await this.redis.connect();

      RedisLogger.info('[START] Redis Connected');
    } catch (error) {
      RedisLogger.error('[START] Redis Connected Error: %o', {
        error,
      });

      throw new RedisError(
        '[START] Redis Connected',
        'Redis Connected Error.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  /**
   *
   * @param clientUuid
   * @param email
   * @param password
   * @returns
   */

  public async deleteItem(encodedEmail: string) {
    try {
      const index = this.keyList.findIndex((item) => item === encodedEmail);

      if (index > -1) {
        this.keyList.splice(index, 1);
        await this.redis.connect();
        await this.redis.del(encodedEmail);
        await this.redis.disconnect();
        RedisLogger.info('[DELETE] Deleted User Info from Key List and Cache Data');
      }
    } catch (error) {
      RedisLogger.error('[DELETE] Delete User Item Error: %o', {
        error,
      });

      throw new RedisError(
        '[DELETE] Delete User Item',
        'Delete User Item Error.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  public async setItem(encodedEmail: string, encodedToken: string, uuid: string, password: string) {
    try {
      if (this.keyList.length >= 5000) {
        RedisLogger.debug('[AccountManager] keyList maximum reached. shift()');
        this.keyList.shift();
      }

      const isKeyExist = this.keyList.findIndex((item) => item === encodedEmail);

      if (isKeyExist > -1) return false;

      const setItem: ClientLoginItem = {
        token: encodedToken,
        uuid,
        password,
      };

      // this.userMap.set( key, { uuid, address, privateKey, pkToken } );
      this.keyList.push(encodedEmail);
      await this.redis.connect();
      await this.redis.set(encodedEmail, JSON.stringify(setItem));
      await this.redis.disconnect();

      return true;
    } catch (error) {
      RedisLogger.error('[SET] User Info Error: %o', {
        error,
      });

      throw new RedisError(
        '[SET] User Info',
        'Set User Info',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  public async getItem(encodedEmail: string) {
    try {
      const key = this.keyList.find((item) => item === encodedEmail);

      RedisLogger.debug('[GET] Client Map Inspection: %o', {
        encodedEmail,
        key,
        // map: this.userMap,
        userKey: this.keyList,
      });

      if (key === undefined) return null;

      RedisLogger.info('[GET] Found key from keyList');

      await this.redis.connect();
      const gotItem = await this.redis.get(key);
      await this.redis.disconnect();

      if (gotItem === null) return null;

      const returnData = JSON.parse(gotItem) as ClientLoginItem;

      return returnData;
    } catch (error) {
      RedisLogger.error('[GET] Get User Item Error: %o', {
        error,
      });

      throw new RedisError(
        '[GET] Get User Item',
        'Get User Item Error.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async setTempData(tempKey: string, email: string, password: string, token: string) {
    try {
      await this.redis.connect();

      const validateItem: ValidateKeyItem = {
        email,
        password,
        token,
      };

      await this.redis.set(tempKey, JSON.stringify(validateItem), {
        EX: 60 * 3,
      });

      await this.redis.disconnect();

      return true;
    } catch (error) {
      RedisLogger.error('[VALIDATE_KEY] Set Temp Key Error: %o', {
        error,
      });

      throw new RedisError(
        '[VALIDATE_KEY] Set Temp Key',
        'Set Temp Key Error',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async getTempData(tempKey: string) {
    try {
      await this.redis.connect();

      const result = await this.redis.get(tempKey);

      if (result === null) return null;

      const returnData = JSON.parse(result) as ValidateKeyItem;

      await this.redis.del(tempKey);

      await this.redis.disconnect();

      return returnData;
    } catch (error) {
      RedisLogger.error('[VALIDATE_KEY] Get Temp Key Error: %o', {
        error,
      });

      throw new RedisError(
        '[ VALIDATE_KEY ] Get Temp Key',
        'Get Temp Key Error',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }
}
