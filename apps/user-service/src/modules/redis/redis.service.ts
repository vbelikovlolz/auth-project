import { Injectable, Inject, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
import { REDIS_CLIENT } from './redis.constants';

@Injectable()
export class RedisService implements OnModuleDestroy {
  constructor(
    @Inject(REDIS_CLIENT)
    private readonly redisClient: Redis,
  ) {}

  async onModuleDestroy() {
    await this.redisClient.quit();
  }

  async get(key: string): Promise<string | null> {
    return this.redisClient.get(key);
  }

  async set(key: string, value: any, ttl?: number): Promise<'OK'> {
    const stringValue =
      typeof value === 'string' ? value : JSON.stringify(value);
    if (ttl) {
      return this.redisClient.setex(key, ttl, stringValue);
    }
    return this.redisClient.set(key, stringValue);
  }

  async setex(key: string, ttl: number, value: any): Promise<'OK'> {
    const stringValue =
      typeof value === 'string' ? value : JSON.stringify(value);
    return this.redisClient.setex(key, ttl, stringValue);
  }

  async del(key: string): Promise<number> {
    return this.redisClient.del(key);
  }
}
