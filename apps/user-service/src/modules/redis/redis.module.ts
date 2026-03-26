import { Module, Global } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisService } from './redis.service';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '@app/shared/config/app.config';

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: (configService: ConfigService): Redis => {
        const appConfig = configService.get<AppConfig>('app')!;

        return new Redis({
          host: appConfig.redisHost,
          port: appConfig.redisPort,
          password: appConfig.redisPass,
          db: appConfig.redisDb,
          retryStrategy: (times) => {
            return Math.min(times * 50, 2000);
          },
        });
      },
      inject: [ConfigService],
    },
    RedisService,
  ],
  exports: ['REDIS_CLIENT', RedisService],
})
export class RedisModule {}
