import { ResolutionError } from '@errors/resolution.error';
import { NoUserError } from '@errors/user.error';
import { fetchSuperResolution } from '@libraries/sr/fetch.lib';
import { Injectable } from '@nestjs/common';
import { MinioClient } from '@providers/common/minio.pvd';
import { SrPrismaLibrary } from '@providers/common/srprisma.pvd';
import { RedisProvider } from '@providers/redis.pvd';
import { ResolutionLogger } from '@utilities/logger.util';

@Injectable()
export class SuperResolutionProvider {
  constructor(
    private readonly prisma: SrPrismaLibrary,
    private readonly minio: MinioClient,
    private readonly redis: RedisProvider,
  ) {}

  async superResolution(encodedEmail: string, uuid: string, fileName: string, versionId: string, weights: string) {
    try {
      const isLogined = await this.redis.getItem(encodedEmail);

      if (isLogined === null) throw new NoUserError('[LOGIN] Login', 'No User Found');

      ResolutionLogger.info('[Request] Received Super Resolution Request: %o', {
        fileName,
        weights,
      });

      ResolutionLogger.info('[Request] Saving File Success: %o', {
        uploadedFileName: fileName,
        versionId,
      });

      await this.prisma.updateSavingImage(uuid, fileName, 'Saved Raw Image', weights);

      // Request Resolution
      const { newFileName, newVersionId } = await fetchSuperResolution(weights, fileName, versionId!);

      const url = await this.minio.getResolutedImageUrl(fileName);

      await this.prisma.updatingSrResults(newFileName, newVersionId, true, uuid, url);

      return { versionId, newFileName, newVersionId, url };
    } catch (error) {
      ResolutionLogger.error('[Request] Run Super Resolution Error: %o', {
        error,
      });

      throw new ResolutionError(
        '[Request] Super Resolution',
        'Run Super Resolution Error',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async uploadRawImage(encodedEmail: string, file: Express.Multer.File) {
    try {
      const isLogined = await this.redis.getItem(encodedEmail);

      if (isLogined === null) throw new NoUserError('[LOGIN] Login', 'No User Found');

      const { uuid: userUuid } = isLogined;

      const { originalname } = file;

      // Task = "raw" / "res"
      const uuid = await this.prisma.insertRawImageInfo(Buffer.from(originalname).toString('utf-8'), userUuid);

      const { fileName: uploadedFileName, versionId } = await this.minio.uploadReceivedImage(file, 'raw');

      return { uuid, uploadedFileName, versionId };
    } catch (error) {
      ResolutionLogger.error('[Upload] Upload Raw Image Error: %o', {
        error,
      });

      throw new ResolutionError(
        '[Upload] Raw Image',
        'Upload Raw Image Error',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }
}
