import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { configValidationUtility } from '../../../setup/config-validation.utility';

@Injectable()
export class RedisConfig {
  @IsString()
  @IsOptional()
  host?: string;

  @IsInt()
  @Min(1)
  @Max(65535)
  port?: number;

  @IsInt()
  db?: number;

  @IsString()
  password?: string;

  constructor(private configService: ConfigService<any, true>) {
    this.host = this.configService.get('REDIS_HOST');
    this.port = parseInt(this.configService.get('REDIS_PORT'));
    this.password = this.configService.get('REDIS_PASSWORD');
    this.db = parseInt(this.configService.get('REDIS_DB'));

    configValidationUtility.validateConfig(this);
  }
}
