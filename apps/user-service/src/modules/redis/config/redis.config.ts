import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IsNotEmpty } from 'class-validator';
import { configValidationUtility } from '../../../setup/config-validation.utility';

@Injectable()
export class RedisConfig {
  constructor(private configService: ConfigService<any, true>) {
    configValidationUtility.validateConfig(this);
  }

  @IsNotEmpty({
    message: 'Set Env variable REDIS_PASSWORD',
  })
  redisPassword: string = this.configService.get('REDIS_PASSWORD');

  @IsNotEmpty({
    message: 'Set Env variable REDIS_PORT',
  })
  redisPort: number = this.configService.get('REDIS_PORT');

  @IsNotEmpty({
    message: 'Set Env variable REDIS_DB',
  })
  redisDb: number = this.configService.get('REDIS_DB');

  @IsNotEmpty({
    message: 'Set Env variable REDIS_HOST',
  })
  redisHost: string = this.configService.get('REDIS_HOST');
}
