import path from 'path';
import { fileURLToPath } from 'url';
import Winston from 'winston';
import WinstonDaily from 'winston-daily-rotate-file';

const fileName = fileURLToPath(import.meta.url);
const dirName = path.dirname(fileName);
const dirSaveName = path.join(dirName, '..', '..', 'logs');

// 로그 포맷 설정
const { colorize, combine, timestamp: defaultTimestamp, printf, splat, json } = Winston.format;

// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
const formatted = printf(({ level, message, timestamp }) => `${timestamp} ${level}: ${message}`);

class WinstonLogger {
  private static instance: WinstonLogger;

  private imageLogger: Winston.Logger;

  private chatLogger: Winston.Logger;

  private audioLogger: Winston.Logger;

  private dataLogger: Winston.Logger;

  private logger: Winston.Logger;

  private apiLogger: Winston.Logger;

  private userLogger: Winston.Logger;

  private commonLogger: Winston.Logger;

  private resolutionLogger: Winston.Logger;

  private redisLogger: Winston.Logger;

  private mailerLogger: Winston.Logger;

  private constructor() {
    this.resolutionLogger = Winston.createLogger({
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      format: combine(splat(), json(), colorize(), defaultTimestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), formatted),
      transports: [
        new Winston.transports.Console(),
        new WinstonDaily({
          datePattern: 'YYYY-MM-DD',
          dirname: dirSaveName,
          filename: '%DATE%.sr.log',
          maxFiles: 30,
          zippedArchive: true,
        }),
      ],
    });

    this.mailerLogger = Winston.createLogger({
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      format: combine(splat(), json(), colorize(), defaultTimestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), formatted),
      transports: [
        new Winston.transports.Console(),
        new WinstonDaily({
          datePattern: 'YYYY-MM-DD',
          dirname: dirSaveName,
          filename: '%DATE%.mailer.log',
          maxFiles: 30,
          zippedArchive: true,
        }),
      ],
    });

    this.redisLogger = Winston.createLogger({
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      format: combine(splat(), json(), colorize(), defaultTimestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), formatted),
      transports: [
        new Winston.transports.Console(),
        new WinstonDaily({
          datePattern: 'YYYY-MM-DD',
          dirname: dirSaveName,
          filename: '%DATE%.redis.log',
          maxFiles: 30,
          zippedArchive: true,
        }),
      ],
    });

    this.commonLogger = Winston.createLogger({
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      format: combine(splat(), json(), colorize(), defaultTimestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), formatted),
      transports: [
        new Winston.transports.Console(),
        new WinstonDaily({
          datePattern: 'YYYY-MM-DD',
          dirname: dirSaveName,
          filename: '%DATE%.common.log',
          maxFiles: 30,
          zippedArchive: true,
        }),
      ],
    });

    this.imageLogger = Winston.createLogger({
      format: combine(splat(), json(), defaultTimestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), formatted),
      transports: [
        new WinstonDaily({
          level: 'debug',
          datePattern: 'YYYY-MM-DD',
          dirname: path.join(dirName, '..', 'logs'),
          filename: '%DATE%.image.log',
          maxFiles: 30,
          zippedArchive: true,
        }),
      ],
    });

    this.userLogger = Winston.createLogger({
      format: combine(splat(), json(), defaultTimestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), formatted),
      transports: [
        new WinstonDaily({
          level: 'debug',
          datePattern: 'YYYY-MM-DD',
          dirname: path.join(dirName, '..', 'logs'),
          filename: '%DATE%.user.log',
          maxFiles: 30,
          zippedArchive: true,
        }),
      ],
    });

    this.audioLogger = Winston.createLogger({
      format: combine(splat(), json(), defaultTimestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), formatted),
      transports: [
        new WinstonDaily({
          level: 'debug',
          datePattern: 'YYYY-MM-DD',
          dirname: path.join(dirName, '..', 'logs'),
          filename: '%DATE%.audio.log',
          maxFiles: 30,
          zippedArchive: true,
        }),
      ],
    });

    this.chatLogger = Winston.createLogger({
      format: combine(splat(), json(), defaultTimestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), formatted),
      transports: [
        new WinstonDaily({
          level: 'debug',
          datePattern: 'YYYY-MM-DD',
          dirname: path.join(dirName, '..', 'logs'),
          filename: '%DATE%.chat.log',
          maxFiles: 30,
          zippedArchive: true,
        }),
      ],
    });

    this.apiLogger = Winston.createLogger({
      format: combine(splat(), json(), defaultTimestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), formatted),
      transports: [
        new WinstonDaily({
          level: 'debug',
          datePattern: 'YYYY-MM-DD',
          dirname: path.join(dirName, '..', 'logs'),
          filename: '%DATE%.parser.log',
          maxFiles: 30,
          zippedArchive: true,
        }),
      ],
    });

    this.dataLogger = Winston.createLogger({
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      format: combine(splat(), json(), colorize(), defaultTimestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), formatted),
      transports: [
        new Winston.transports.Console(),
        new WinstonDaily({
          datePattern: 'YYYY-MM-DD',
          dirname: dirSaveName,
          filename: '%DATE%.data.log',
          maxFiles: 30,
          zippedArchive: true,
        }),
      ],
    });

    this.logger = Winston.createLogger({
      format: combine(splat(), json(), defaultTimestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), formatted),
      transports: [
        new WinstonDaily({
          level: 'error',
          datePattern: 'YYYY-MM-DD',
          dirname: path.join(dirName, '..', 'logs'),
          filename: '%DATE%.error.log',
          maxFiles: 100,
          zippedArchive: true,
        }),
        new WinstonDaily({
          level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
          datePattern: 'YYYY-MM-DD',
          dirname: path.join(dirName, '..', 'logs'),
          filename: '%DATE%.combined.log',
          maxFiles: 100,
          zippedArchive: true,
        }),
      ],
    });

    if (process.env.NODE_ENV !== 'production') {
      this.logger.add(
        new Winston.transports.Console({
          format: combine(colorize(), formatted),
        }),
      );
    }
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new WinstonLogger();
    }

    return {
      ImageLogger: this.instance.imageLogger,
      Logger: this.instance.logger,
      ChatLogger: this.instance.chatLogger,
      apiLogger: this.instance.apiLogger,
      AudioLogger: this.instance.audioLogger,
      CommonLogger: this.instance.commonLogger,
      UserLogger: this.instance.userLogger,
      DataLogger: this.instance.dataLogger,
      ResolutionLogger: this.instance.resolutionLogger,
      RedisLogger: this.instance.redisLogger,
      MailerLogger: this.instance.mailerLogger,
    };
  }
}

const {
  CommonLogger,
  ImageLogger,
  Logger,
  apiLogger,
  ChatLogger,
  AudioLogger,
  UserLogger,
  ResolutionLogger,
  DataLogger,
  RedisLogger,
  MailerLogger,
} = WinstonLogger.getInstance();

export {
  CommonLogger,
  ImageLogger,
  Logger,
  apiLogger,
  ChatLogger,
  AudioLogger,
  UserLogger,
  DataLogger,
  ResolutionLogger,
  RedisLogger,
  MailerLogger,
};
