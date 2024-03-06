import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
// import { AudioModule } from './audio.module';
import { globalMiddleware } from 'middlewares/ip.middlewares';
import { ChatModule } from './chat/chat.module';
import { SuperResolutionModule } from './sr/resolution.module';
import { ImageModule } from './image/image.module';
import { AudioModule } from './song/audio.module';
// import { UserModule } from './user.module';

@Module({ imports: [ChatModule, SuperResolutionModule, ImageModule, AudioModule] })
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(globalMiddleware).forRoutes('*');
  }
}
