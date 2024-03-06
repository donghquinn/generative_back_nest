import { ImageError } from '@errors/img.error';
import { ResponseError } from '@errors/response.error';
import { NoUserError } from '@errors/user.error';
import { getImageBuffer } from '@libraries/gpt/image/buffer.lib';
import { Injectable } from '@nestjs/common';
import { MinioClient } from '@providers/common/minio.pvd';
import { OpenAiProvider } from '@providers/common/openai.pvd';
import { PrismaLibrary } from '@providers/common/prisma.pvd';
import { RedisProvider } from '@providers/redis.pvd';
import { ImageLogger } from '@utilities/logger.util';
import moment from 'moment-timezone';
import { OpenAIError } from 'openai';
import { ImageResponseFormat } from 'types/img.type';
import { SizeTypes } from 'types/request.types';

@Injectable()
export class GenerateImageProvider {
  private now: string;

  constructor(
    private readonly prisma: PrismaLibrary,
    private readonly minio: MinioClient,
    private readonly openai: OpenAiProvider,
    private readonly redis: RedisProvider,
  ) {
    this.now = moment.utc().tz('Asia/Seoul').format('YYYY-MM-DD HH:mm:ss');
  }

  /**
   * 이미지 생성 요청
   * @param promt: 이미지 요청 내용
   * @param number: 생성할 이미지 개수
   * @param size: 이미지 사이즈
   * @returns img url
   */
  async requestGenerateImage(
    encodedEmail: string,
    prompt: string,
    number: string,
    size?: SizeTypes,
    responseFormat?: ImageResponseFormat,
    user?: string,
  ) {
    try {
      const isLogined = await this.redis.getItem(encodedEmail);

      if (isLogined === null) throw new NoUserError('[LOGIN] Login', 'No User Found');

      const { uuid } = isLogined;

      const urlArray: Array<string> = [];
      urlArray.length = 0;

      const response = await this.openai.genereateImage(prompt, number, size, responseFormat, user);

      if (response) {
        for (let i = 0; i < Number(number); i += 1) {
          const imageUrl = response.data[i].url!;

          ImageLogger.info('Url: %o', { url: imageUrl });
          urlArray.push(imageUrl);

          await this.prisma.insertImageData(uuid, prompt, number, imageUrl, this.now, size);

          const stream = await getImageBuffer(imageUrl);

          await this.minio.uploadGeneratedImage(stream, number + this.now.trim());
        }

        ImageLogger.debug('Image URL List Response: %o', { urlArray });

        return urlArray;
      }
    } catch (error) {
      if (error instanceof OpenAIError) {
        ImageLogger.error('[IMAGE] Image Generate Failed. Arrived at Usage Limit: %o', {
          message: error.message,
          cause: error.cause,
        });

        throw new ResponseError('[IMAGE] Image Generate', 'Image Generate Failed', new Error('Rate Limit'));
      }

      ImageLogger.error('[IMAGE] Image Generate Error: %o', {
        error,
      });

      throw new ImageError(
        '[IMAGE] Generate Image',
        'Image Generate Error. Please Try Again.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  /**
   *https://velog.io/@dev_leewoooo/NestJs-%ED%8C%8C%EC%9D%BC%EC%97%85%EB%A1%9C%EB%93%9C-%EC%9D%B4-%EA%B8%80%EB%A1%9C-%EB%81%9D
   * @param image 수정할 이미지 파일. 반드시 PNG
   * @param prompt 이미지 수정에 사용할 프롬프트
   * @param size 256x256, 512x512, 1024x1024
   * @param number 생성할 이미지 개수
   * @param mask
   * @returns
   */
  // async requestEditImage(image: Express.Multer.File, prompt: string, size: string, number: string, mask?: string) {
  //   try {
  //     Logger.debug('Request Start: %o', { image, prompt, size, number });

  //     // fs.readFile(image);
  //     const urlArray: Array<string> = [];
  //     urlArray.length = 0;

  //     const seningImage = image.buffer;

  //     const response = await this.openai.images.edit( {
  //              image: seningImage,
  //       prompt,
  //     }

  //     );

  //     Logger.debug('Image Edit Response: %o', {
  //       status: response.status,
  //       statusText: response.statusText,
  //     });

  //     if (response.status === 200) {
  //       // const imgUrl: Array<ImageSchema> = [];
  //       for (let i = 0; i < Number(number); i += 1) {
  //         urlArray.push(response.data.data[ i ].url!);

  //         Logger.debug('Url: %o', { url: response.data.data[ i ].url! });
  //       }

  //       return urlArray;
  //     }

  //     Logger.error('Edit Image Request Failed');

  //     throw new ImageError('Edit Image', 'Image Response Failed');
  //   } catch (error) {
  //     ImageLogger.error(
  //       `[GENERATE] Request Failed: %o`,
  //       error instanceof Error ? error : new Error(JSON.stringify(error)),
  //     );

  //     throw new ImageError(
  //       'Edit Image',
  //       'Request Failed',
  //       error instanceof Error ? error : new Error(JSON.stringify(error)),
  //     );
  //   }
}
