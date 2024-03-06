import { AudioError } from '@errors/audio.error';
import { NoUserError } from '@errors/user.error';
import { client } from '@gradio/client';
import { Injectable } from '@nestjs/common';
import { MinioClient } from '@providers/common/minio.pvd';
import { PrismaLibrary } from '@providers/common/prisma.pvd';
import { RedisProvider } from '@providers/redis.pvd';
import { AudioLogger } from '@utilities/logger.util';
import { LyricResponse, SongData, SongResponse } from 'types/audio/song.type';

@Injectable()
export class AudioProvider {
  private baseUrl: string;

  private token: string | undefined;

  constructor(
    private readonly prisma: PrismaLibrary,
    private readonly minio: MinioClient,
    private readonly redis: RedisProvider,
  ) {
    this.baseUrl = 'https://seawolf2357-hyejasong.hf.space/--replicas/wb6iu/';

    this.token = process.env.HF_TOKEN;
  }

  async songHandler(encodedEmail: string, selectedSong: string, lyric?: string, emotion?: string) {
    try {
      const isLogined = await this.redis.getItem(encodedEmail);

      if (isLogined === null) throw new NoUserError('[LOGIN] Login', 'No User Found');

      const { uuid } = isLogined;

      AudioLogger.info('[SONG] Received generate Lyrics and Songs: %o', {
        selectedSong,
        lyric,
        emotion,
      });

      if (lyric === undefined && typeof emotion === 'string') {
        const lyrics = await this.createLyrics(emotion);

        AudioLogger.info('[SONG] Received generate Lyrics and Songs: %o', {
          selectedSong,
          lyrics,
          emotion,
        });

        const { uuid: songUuid } = await this.prisma.song.create({
          data: {
            client_uuid: uuid,
            select: selectedSong,
            lyrics: lyrics.toString(),
            emotion,
          },
        });

        const songs = await this.generateSong(selectedSong, lyrics.join(','));

        await this.prisma.song.update({
          data: {
            url: songs[0].FileData.url,
          },
          where: {
            uuid: songUuid,
          },
        });

        return songs;
      }

      AudioLogger.info('[SONG] Received generate Songs: %o', {
        selectedSong,
        lyric,
        emotion,
      });

      const { uuid: songUuid } = await this.prisma.song.create({
        data: {
          client_uuid: uuid,
          select: selectedSong,
          lyrics: lyric!.toString(),
          emotion,
        },
      });

      const songs = await this.generateSong(selectedSong, lyric!);

      await this.prisma.song.update({
        data: {
          url: songs[0].FileData.url,
        },
        where: {
          uuid: songUuid,
        },
      });

      AudioLogger.info('[LYRICS] Generated: %o', {
        lyrics: songs,
      });

      await this.uploadGeneratedSong(songs[0].FileData.url);

      return songs;
    } catch (error) {
      AudioLogger.error('[LYRICS] Generate Lyrics By Emotions Error: %o', {
        error,
      });

      throw new AudioError(
        '[LYRICS] Generate Lyrics following Emotions',
        'Generate Lyrics By Emotions Error. Please Try Again.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  private async uploadGeneratedSong(url: string) {
    try {
      const options = { method: 'GET' };
      const response = await fetch(url, options);

      if (!response.ok || response.body === null)
        throw new AudioError('[SONG] Upload Generated Song', 'Upload Generated Song Error.');

      const audioStream = response.body;

      const fileName = `${new Date().toLocaleString()}.mp3`;

      await this.minio.uploadSongFile(audioStream, fileName);
    } catch (error) {
      AudioLogger.error('[UPLOAD] Upload Generated Lyrics Error: %o', {
        error,
      });

      throw new AudioError(
        '[UPLOAD] Upload Genereated Lyrics',
        'Upload Generated Lyrics Error.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  private async createLyrics(emotion: string): Promise<Array<string>> {
    try {
      AudioLogger.info('[LYRICS] Generate Lyric Start: %o', { emotion });

      const app = await client(this.baseUrl, {
        hf_token: `hf_${this.token}`,
      });

      const result = (await app.predict('/auto_generate_lyrics', [emotion])) as LyricResponse;

      AudioLogger.info('[LYRICS] Generated: %o', {
        lyrics: result.data,
      });

      return result.data;
    } catch (error) {
      AudioLogger.error('[LYRICS] Generate Lyrics By Emotions Error: %o', {
        error,
      });

      throw new AudioError(
        '[LYRICS] Generate Lyrics following Emotions',
        'Generate Lyrics By Emotions Error. Please Try Again.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }

  private async generateSong(selectedSong: string, lyrics: string): Promise<Array<SongData>> {
    try {
      AudioLogger.info('[LYRICS] Generate Song Start: %o', { selectedSong, lyrics });

      const app = await client(this.baseUrl, {
        hf_token: `hf_${this.token}`,
      });

      const result = (await app.predict('/generate_song', [selectedSong, lyrics])) as SongResponse;

      AudioLogger.info('[SONG] Generated: %o', {
        lyrics: result,
      });

      return result.data;
    } catch (error) {
      AudioLogger.error('[SONG] Generate Song By Emotions Error: %o', {
        error,
      });

      throw new AudioError(
        '[SONG] Generate Song following Emotions',
        'Generate Song By Emotions Error. Please Try Again.',
        error instanceof Error ? error : new Error(JSON.stringify(error)),
      );
    }
  }
}
