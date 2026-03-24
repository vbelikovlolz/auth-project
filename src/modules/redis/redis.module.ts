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
          host: redisConfig.host || 'localhost',
          port: redisConfig.port || 6379,
          password: redisConfig.password,
          db: redisConfig.db || 0,
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
