import { Module, Global } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisConfig } from './config/redis.config';
import { RedisService } from './redis.service';

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: (redisConfig: RedisConfig): Redis => {
        return new Redis({
          host: redisConfig.redisHost || 'localhost',
          port: redisConfig.redisPort || 6379,
          password: redisConfig.redisPassword,
          db: redisConfig.redisDb || 0,
          retryStrategy: (times) => {
            return Math.min(times * 50, 2000);
          },
        });
      },
      inject: [RedisConfig],
    },
    RedisConfig,
    RedisService,
  ],
  exports: ['REDIS_CLIENT', RedisService, RedisConfig],
})
export class RedisModule {}
