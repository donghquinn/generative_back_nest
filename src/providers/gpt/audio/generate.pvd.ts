// import { Injectable } from '@nestjs/common';
// import { AudioError } from 'error/audio.error';
// import fs from 'fs';
// import { PrismaLibrary } from 'libraries/common/prisma/prisma.lib';
// import { ClientOptions, OpenAI } from 'openai';
// import { AudioLogger } from 'utilities/logger.utils';

// @Injectable()
// export class AudioProvider {
//   private openai: OpenAI;

//   private configuration: ClientOptions;

//   constructor(private prisma: PrismaLibrary) {
//     this.configuration ={
//       apiKey: process.env.CHATGPT_API_TOKEN2,
//     };

//     this.openai = new OpenAI(this.configuration);
//   }

//   async readFileAsBase64(filePath: string): Promise<string> {
//     const fileData = fs.readFileSync(filePath);

//     const base64Data = Buffer.from(fileData).toString('base64');

//     return base64Data;
//   }

//   /**
//    * targetLanguage : https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
//    *
//    * @param fileName 사용팔 파일 이름
//    * @param targetLanguage 타겟 언어: Korean: "ko", English: "en", Japanese: "ja", Urdu: "ur"
//    * @param prompt
//    * @param response_format
//    * @param temperature
//    * @returns
//    */
//   async transcript(
//     fileName: string,
//     targetLanguage: string,
//     prompt?: string,
//     response_format?: string,
//     temperature?: number,
//   ) {
//     try {
//       const file = await this.readFileAsBase64(fileName);

//       const response = await this.openai.audio.transcriptions.create({
//         file,
//         'whisper-1',
//         prompt,
//         response_format,
//         temperature,
//         targetLanguage,
//       });

//       if (response.status == 200) {
//         const transcriptionResponse = response.data.text[0];

//         AudioLogger.info('Received Transcription Response: %o', { response: transcriptionResponse });

//         await this.prisma.audio.create({
//           data: { file, prompt, response_format, response: transcriptionResponse, type: 'transcript' },
//         });

//         return transcriptionResponse;
//       }

//       AudioLogger.info('Receive Error: %o', { status: response.statusText });

//       return response.statusText;
//     } catch (error) {
//       AudioLogger.error('Audio Translation Error: %o', {
//         error: error instanceof Error ? error : new Error(JSON.stringify(error)),
//       });

//       throw new AudioError(
//         'Audio Translation',
//         'Audio Error',
//         error instanceof Error ? error : new Error(JSON.stringify(error)),
//       );
//     }
//   }
// }
