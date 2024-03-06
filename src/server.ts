import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import { MinioClient } from '@providers/common/minio.pvd';
import { AppModule } from 'module/app.module';
import { shutdown } from 'utilities/shutdown.util';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { RedisProvider } from '@providers/redis.pvd';

export const bootstrap = async () => {
  const port = process.env.APP_PORT!;

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const client = new MinioClient();
  const redis = new RedisProvider();

  await client.isExistBucket();
  await redis.start();

  const corsOptions: CorsOptions = {
    origin: 'https://gpt.donghyuns.com',
    allowedHeaders: ['GET', 'POST', 'Content-Type', 'Authorization', 'key'],
    optionsSuccessStatus: 204,
    preflightContinue: false,
  };

  app.use(helmet());
  app.set('trust proxy', 1);
  app.enableVersioning();
  app.useBodyParser('json');
  app.enableCors(corsOptions);
  // app.useStaticAssets(path.join(__dirname, './common', 'uploads'), { prefix: '/media' });

  await app.listen(port, '0.0.0.0', () => {
    const message = 'Server Started';
    const wrapper = '@'.repeat(message.length);

    Logger.log(wrapper);
    Logger.log(message);
    Logger.log(wrapper);
  });

  process.on('SIGTERM', () => shutdown(app));
};
