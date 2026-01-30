import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IsNotEmpty } from 'class-validator';
import { configValidationUtility } from '../../../../setup/config-validation.utility';

@Injectable()
export class S3Config {
  constructor(private configService: ConfigService<any, true>) {
    configValidationUtility.validateConfig(this);
  }

  @IsNotEmpty({
    message: 'Set Env variable MINIO_ROOT_USER',
  })
  minioRootUser: string = this.configService.get('MINIO_ROOT_USER');

  @IsNotEmpty({
    message: 'Set Env variable MINIO_ROOT_PASSWORD',
  })
  minioRootPassword: string = this.configService.get('MINIO_ROOT_PASSWORD');

  @IsNotEmpty({
    message: 'Set Env variable ACCESS_KEY_ID',
  })
  accessKeyId: string = this.configService.get('ACCESS_KEY_ID');

  @IsNotEmpty({
    message: 'Set Env variable SECRET_ACCESS_KEY',
  })
  secretAccessKey: string = this.configService.get('SECRET_ACCESS_KEY');
}
