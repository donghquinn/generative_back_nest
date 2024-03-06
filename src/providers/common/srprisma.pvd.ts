import { Injectable } from '@nestjs/common';
import { PrismaLibrary } from './prisma.pvd';
import { CommonLogger } from '@utilities/logger.util';
import { PrismaError } from '@errors/prisma.error';

@Injectable()
export class SrPrismaLibrary {
  constructor(private readonly prisma: PrismaLibrary) {}

  async insertRawImageInfo(originalName: string, clientUuid: string) {
    try {
      CommonLogger.info('[Upload] Received Raw Image Original File Name: %o', {
        originalName,
      });

      const uuid = await this.prisma.superResolution.create({
        data: {
          client_uuid: clientUuid,
          raw_fileName: originalName,
          status: 'raw_image',
        },
      });

      return uuid.uuid;
    } catch (error) {
      CommonLogger.error('[Upload] Uploading Raw Image Info Error: %o', {
        error,
      });

      throw new PrismaError(
        '[Upload] Raw Image Info',
        'Uploading Raw Image Info Error',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async receivedSrRequest(uuid: string, task: string, fileName: string, weights: string) {
    try {
      CommonLogger.info('[Request] Received Super-Resolution Request Saving: %o', {
        task,
        fileName,
        weights,
      });

      const result = await this.prisma.superResolution.update({
        data: {
          task,
          raw_fileName: fileName,
          weights,
          status: 'Received',
        },
        where: {
          uuid,
          raw_fileName: fileName,
        },
      });

      CommonLogger.info('[Request] Saving Received Super-Resolution Request Success: %o', {
        uuid: result.uuid,
      });

      return result.uuid;
    } catch (error) {
      CommonLogger.error('[Request] Prisma Saving Super-Resolution Request Info Error: %o', {
        error,
      });

      throw new PrismaError(
        '[Request] Saving Request Info',
        'Saving Request Info Error',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async updateSavingImage(uuid: string, fileName: string, status: string, weights: string) {
    try {
      CommonLogger.info('[Upload] Update Saving Image: %o', {
        fileName,
        status,
      });

      const result = await this.prisma.superResolution.update({
        data: {
          status,
          weights,
        },
        where: {
          uuid: uuid,
          raw_fileName: fileName,
        },
      });

      return result.uuid;
    } catch (error) {
      CommonLogger.error('[Upload] Minio Saving Raw Image Error: %o', {
        error,
      });

      throw new PrismaError(
        '[Upload] Minio Saving Raw Image',
        'Uploading Minio Raw Image Error',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async updatingSrResults(newFileName: string, newVersionId: string, isSuccess: boolean, uuid: string, url: string) {
    try {
      CommonLogger.info('[Result] Prisma Received Super-Resoluted Results: %o', {
        resoluted: newFileName,
        newVersionId,
        isSuccess,
      });

      await this.prisma.superResolution.update({
        data: {
          resoluted_fileName: newFileName,
          resoluted_version_id: newVersionId,
          resoluted_url: url,
          is_success: isSuccess,
        },
        where: {
          uuid,
        },
      });

      CommonLogger.info('[Result] Prisma Updating Super-Resolution Request Success: %o', {
        newFileName: newFileName,
        newVersionId,
      });

      return { newFileName, newVersionId };
    } catch (error) {
      CommonLogger.error('[Result] Prisma Updating Super-Resolution Request Info Error: %o', {
        error,
      });

      throw new PrismaError(
        '[Result] Updating Request Info',
        'Updating Request Info Error',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }
}
