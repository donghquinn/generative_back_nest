import { createHash, randomBytes } from 'crypto';

/**
 * @param certKey 고객 인증키. 임의의 16파이트 키
 * @returns hashToken - token 필드에 들어갈 값, uuid - 고객 uuid
 */
export const createToken = (certKey: string) => {
  const clientKey = randomBytes(16).toString('base64');

  const rawKeys = certKey + clientKey;

  const hashBase = createHash('sha256');

  const hashToken = hashBase.update(rawKeys, 'utf-8').digest('hex');

  // const uuid = v4();

  return { hashToken };
};
