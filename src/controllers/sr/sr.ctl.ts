import { Body, Controller, Post, UploadedFile, UseInterceptors, Headers } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SuperResolutionProvider } from '@providers/sr/resolution.pvd';
import { ResolutionLogger } from '@utilities/logger.util';
import { fileExtensionValidator } from '@validators/file.validator';
import { superResolutionValidator } from '@validators/resolution.validator';
import { SetErrorResponse, SetResponse } from 'dto/response.dto';
import { SuperResolutionRequest } from 'types/resolution.types';

@Controller('/sr')
export class SuperResolutionController {
  constructor(private readonly superResolution: SuperResolutionProvider) {}

  @Post('/image')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 1024 * 1024 * 5 },
    }),
  )
  async uploadAndResolution(@UploadedFile() file: Express.Multer.File, @Headers('Authorization') email: string) {
    try {
      ResolutionLogger.info('[Request] Received Super Resolution Request: %o', {
        originalFileName: Buffer.from(file.originalname, 'latin1').toString('utf-8'),
        mimeType: file.mimetype,
        size: file.size,
        path: file.path,
      });

      fileExtensionValidator(file.originalname);

      const { uuid, versionId, uploadedFileName } = await this.superResolution.uploadRawImage(email, file);

      return new SetResponse(200, {
        uuid,
        versionId,
        uploadedFileName,
      });
    } catch (error) {
      return new SetErrorResponse(error);
    }
  }

  @Post('/resolution')
  async resolutionRequest(@Body() request: SuperResolutionRequest) {
    try {
      const { email, uuid, fileName, weights, versionId } = await superResolutionValidator(request);

      ResolutionLogger.info('[Request] Received Super Resolution Request: %o', {
        uuid,
        fileName,
        weights,
        versionId,
      });

      const {
        versionId: rawVersionId,
        newFileName,
        newVersionId,
      } = await this.superResolution.superResolution(email, uuid, fileName, versionId, weights);

      return new SetResponse(200, { uuid, rawVersionId, newFileName, newVersionId });
    } catch (error) {
      return new SetErrorResponse(error);
    }
  }
}
