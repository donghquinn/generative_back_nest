import { Body, Controller, Post } from '@nestjs/common';
import { GenerateImageProvider } from '@providers/gpt/img/getImages.pvd';
import { ImageLogger } from '@utilities/logger.util';
import { imageGenerateValidator } from '@validators/image/request.validator';
import { SetErrorResponse, SetResponse } from 'dto/response.dto';
import { ImageRequestTypes } from 'types/request.types';

@Controller('img')
export class ImageController {
  constructor(private readonly generateImage: GenerateImageProvider) {}

  @Post('/generate')
  async generateImageRoute(@Body() request: ImageRequestTypes) {
    try {
      ImageLogger.debug('Received Image Request: %o', { request });

      const { email, prompt, number, size, responseFormat, user } = await imageGenerateValidator(request);

      ImageLogger.debug('Validated: %o', { prompt, number, size, responseFormat, user });

      ImageLogger.info('Start Request');

      const result = await this.generateImage.requestGenerateImage(email, prompt, number, size, responseFormat, user);

      return new SetResponse(200, { result });
    } catch (error) {
      return new SetErrorResponse(error);
    }
  }

  // @Post('/edit')
  // @UseInterceptors(
  //   FileInterceptor('file', {
  //     limits: { fileSize: 1024 * 1024 * 5 },
  //   }),
  // )
  // async editImageRoute(@UploadedFile() image: Express.Multer.File) {
  //   try {
  //     ImageLogger.info('Image File: %o', {
  //       fileName: image.originalname,
  //     });

  //     // if (image.mimetype !== "image/png") {
  //     //   return new SetErrorResponse(500, { error: "Request Image file is not PNG. Please provie PNG file" });
  //     // }

  //     const result = await this.generateImage.requestEditImage(image, 'smile', '1', '256x256');
  //     return new SetResponse(500, { result });
  //   } catch (error) {
  //     return new SetErrorResponse(500, { error });
  //   }
  // }
}
