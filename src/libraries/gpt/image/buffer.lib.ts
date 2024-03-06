import { ImageError } from '@errors/img.error';
import axios from 'axios';
import { Readable } from 'stream';

export const getImageBuffer = async (imageUrl: string): Promise<Readable> => {
  try {
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data);

    const readableStream = new Readable();
    readableStream.push(buffer);
    readableStream.push(null);

    return readableStream;
  } catch (error) {
    throw new ImageError(
      '[BUFFER] Get Image URL Buffer',
      'Get Image Url Buffer Error.',
      error instanceof Error ? error : new Error(JSON.stringify(error)),
    );
  }
};
