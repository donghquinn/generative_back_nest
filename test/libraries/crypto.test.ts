import { comparePassword, decrypt } from '@libraries/crypto/decrypt.lib';
import { cryptData } from '@libraries/crypto/encrypt.lib';

describe('Encrypt Password', () => {
  describe('Check ENV', () => {
    const key = process.env.SECRET_KEY;

    expect(key).toBeDefined();
  });

  describe('Encrypt Password and Decrypt it', () => {
    const password = '12345asdc';

    const { encodedData, encodedToken } = cryptData(password);

    const isMatch = comparePassword(password, encodedData, encodedToken);

    test('Encoded Password should be decripted', () => {
      expect(isMatch).toBeTruthy();
    });
  });
});
