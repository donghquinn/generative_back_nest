import { MinioError } from '@errors/minio.error';
import { Injectable } from '@nestjs/common';
import { DataLogger } from '@utilities/logger.util';
import * as Minio from 'minio';
import { ReadableStream } from 'node:stream/web';
import { Readable, Writable, pipeline } from 'stream';
import { promisify } from 'util';

@Injectable()
export class MinioClient {
  private static instance: MinioClient;

  private client: Minio.Client;

  private endpoint: string;

  private accessKey: string;

  private secretKey: string;

  private rawImageBucket: string;

  private resolutedImageBucket: string;

  private generateImageBucket: string;

  private audioBucket: string;

  constructor() {
    this.endpoint = process.env.MINIO_URL === undefined ? 'minio.example.com' : 'process.env.MINIO_URL';
    this.accessKey = process.env.MINIO_ACCESSKEY === undefined ? '1234567' : process.env.MINIO_ACCESSKEY;
    this.secretKey = process.env.MINIO_SECRET === undefined ? '8901234' : process.env.MINIO_SECRET;

    this.rawImageBucket = process.env.MINIO_RAW_BUCKET === undefined ? 'raw' : process.env.MINIO_RAW_BUCKET;
    this.resolutedImageBucket = process.env.MINIO_RES_BUCKET === undefined ? 'resoluted' : process.env.MINIO_RES_BUCKET;
    this.generateImageBucket = process.env.MINIO_GEN_BUCKET === undefined ? 'gen' : process.env.MINIO_GEN_BUCKET;
    this.audioBucket = process.env.MINIO_AUDIO_BUCKET === undefined ? 'audio' : process.env.MINIO_AUDIO_BUCKET;

    this.client = new Minio.Client({
      endPoint: this.endpoint,
      accessKey: this.accessKey,
      secretKey: this.secretKey,
    });
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new MinioClient();
    }

    return this.instance;
  }

  public async isExistBucket() {
    try {
      const isRawExist = await this.client.bucketExists(this.rawImageBucket);
      const isResExist = await this.client.bucketExists(this.resolutedImageBucket);
      const isGenExist = await this.client.bucketExists(this.generateImageBucket);
      const isAudioExist = await this.client.bucketExists(this.audioBucket);

      if (!isRawExist) {
        DataLogger.info('[Minio] No Requested Raw Image Bucket Exist. Start to Make Bucket: %o', {
          bucketName: this.rawImageBucket,
        });

        await this.client.makeBucket(this.rawImageBucket);
      }

      if (!isResExist) {
        DataLogger.info('[Minio] No Requested Resoluted Image Bucket Exist. Start to Make Bucket: %o', {
          bucketName: this.resolutedImageBucket,
        });

        await this.client.makeBucket(this.resolutedImageBucket);
      }

      if (!isGenExist) {
        DataLogger.info('[Minio] No Requested Generated Image Bucket Exist. Start to Make Bucket: %o', {
          bucketName: this.generateImageBucket,
        });

        await this.client.makeBucket(this.generateImageBucket);
      }

      if (!isAudioExist) {
        DataLogger.info('[Minio] No Requested Generated Audio Bucket Exist. Start to Make Bucket: %o', {
          bucketName: this.audioBucket,
        });

        await this.client.makeBucket(this.audioBucket);
      }

      DataLogger.info('[Minio] Founded Request Raw Image and Res Image Bucket: %o', {
        rawImagebucketName: this.rawImageBucket,
        resolutedImageBucket: this.resolutedImageBucket,
        generatedImageBucket: this.generateImageBucket,
        generatedAudioBucket: this.audioBucket,
      });

      return {
        rawBucket: this.rawImageBucket,
        resBucket: this.resolutedImageBucket,
        genBucket: this.generateImageBucket,
        audBucket: this.audioBucket,
      };
    } catch (error) {
      DataLogger.error('[Minio] Data Bucket Check Error: %o', {
        error,
      });

      throw new MinioError(
        '[Minio] Check buckets',
        'Check bucket list error',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  public async downloadRawImage(fileName: string, downloadPath: string) {
    try {
      const isExist = await this.isExistBucket();

      if (isExist) {
        await this.client.fGetObject(this.rawImageBucket, fileName, downloadPath);

        DataLogger.info('[Minio] Download Success: %o', {
          bucketName: this.rawImageBucket,
          fileName,
          downloadPath,
        });

        return true;
      }

      DataLogger.info('[Minio] Download Failed. No Bucket Exist: %o', {
        bucketName: this.rawImageBucket,
        fileName,
        downloadPath,
      });

      return false;
    } catch (error) {
      DataLogger.error('[Minio] Download Object Error: %o', {
        error,
      });

      throw new MinioError(
        '[Minio] Download Object',
        'Download Object Error',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async uploadGeneratedImage(stream: Readable, objectName: string) {
    try {
      DataLogger.info('[Generated] Upload Generated Image Upload: %o', {
        objectName,
      });

      await this.client.putObject(this.generateImageBucket, objectName, stream);
    } catch (error) {
      DataLogger.error('[Minio] Generated Image File Upload Error: %o', {
        error,
      });

      throw new MinioError(
        'Minio Generated Image Upload',
        'Minio Generated Image Upload Error',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async uploadReceivedImage(file: Express.Multer.File, task: string) {
    try {
      const { originalname, fieldname, mimetype, size, buffer } = file;

      const fileName = Buffer.from(originalname).toString('utf-8');
      const fieldName = fieldname;
      const mimeType = mimetype;
      const fileBuffer = buffer;
      const fileSize = size;
      const bucketName = task == 'raw' ? this.rawImageBucket : this.resolutedImageBucket;

      DataLogger.info('Start Data Uploading Information: %o', {
        fileName,
        fieldName,
        mimeType,
        fileBuffer,
        fileSize,
        task,
        bucketName,
      });

      const metadata = {
        'Content-Type': mimeType,
      };

      const result = await this.client.putObject(bucketName, fileName, fileBuffer, metadata);

      DataLogger.info('Finished: Data File Uploaded: %o', {
        result,
        versionId: result.versionId,
      });

      const url = await this.getImageUrl(originalname);

      return { fileName, url, versionId: result.versionId };
    } catch (error) {
      DataLogger.error('[Minio] Data File Upload Error: %o', {
        error,
      });

      throw new MinioError(
        'Minio Dataset Upload',
        'Minio Dataset Upload Error',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async getResolutedImageUrl(fileName: string) {
    try {
      // Expiration Time: 24Hours
      const url = await this.client.presignedUrl('GET', this.resolutedImageBucket, fileName, 60 * 30);

      DataLogger.info('[Minio] Get Resoluted Image URL: %o', { url });

      return url;
    } catch (error) {
      DataLogger.error('[Minio] Get Resolutioned Image Url Error: %o', {
        error: error instanceof Error ? error : new Error(JSON.stringify(error)),
      });

      throw new MinioError(
        'Minio Get Resolutioned Image Url',
        'Minio Get Resolutioned Image Url Error',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async getImageUrl(originalName: string) {
    try {
      DataLogger.info('[MINIO] Get Image Url Start: %o', { originalName });

      const imageUrl = await this.client.presignedUrl('GET', this.rawImageBucket, originalName, 60 * 30);

      DataLogger.info('[MINIO] Got Image Url. Expire limits an half Hour: %o', { imageUrl });

      return imageUrl;
    } catch (error) {
      DataLogger.error('[Minio] Get Image URL Error: %o', {
        error,
      });

      throw new MinioError(
        'Minio Get Image URL',
        'Minio Get Image URL Error',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  async uploadSongFile(stream: ReadableStream, objectName: string): Promise<void> {
    try {
      DataLogger.info('[SONG] Upload Generated Audio Upload: %o', {
        objectName,
      });

      const minioStream = new Writable();

      minioStream._write = (chunk, encoding, next) => {
        this.client.putObject(this.generateImageBucket, objectName, chunk, (err, etag) => {
          if (err) return next(err);
          next();
        });
      };

      const pipelineAsync = promisify(pipeline);
      await pipelineAsync(stream, minioStream);
    } catch (error) {
      DataLogger.error('[SONG] Generated Audio File Upload Error: %o', {
        error,
      });

      throw new MinioError(
        '[SONG] Minio Generated Audio Upload',
        'Minio Generated Audio Upload Error',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }
}
