import { Body, Controller, Post } from '@nestjs/common';
import { AudioProvider } from '@providers/audio/song.pvd';
import { AudioLogger } from '@utilities/logger.util';
import { songGenerateValidator } from '@validators/song/request.validator';
import { SetErrorResponse, SetResponse } from 'dto/response.dto';
import { SongGenerateRequest } from 'types/audio/song.type';

@Controller('audio')
export class AudioController {
  constructor(private readonly audio: AudioProvider) {}

  @Post('/song')
  async createSongController(@Body() request: SongGenerateRequest) {
    try {
      const { email, select, emotion, lyric } = await songGenerateValidator(request);

      const result = await this.audio.songHandler(email, select, lyric, emotion);

      return new SetResponse(200, { result });
    } catch (error) {
      return new SetErrorResponse(error);
    }
  }
}
