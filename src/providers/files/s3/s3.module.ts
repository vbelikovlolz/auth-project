import * as AWS from '@aws-sdk/client-s3';
import { Module } from '@nestjs/common';

import { S3Lib } from './constants/do-spaces-service-lib.constant';
import { S3Service } from './s3.service';
import { IFileService } from '../files.adapter';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '../../../config/app.config';

@Module({
  providers: [
    S3Service,
    {
      provide: S3Lib,
      useFactory: (configService: ConfigService) => {
        const appConfig = configService.get<AppConfig>('app')!;

        return new AWS.S3({
          endpoint: 'http://127.0.0.1:9000',
          region: 'ru-central1',
          credentials: {
            accessKeyId: appConfig.minioAccessKeyId,
            secretAccessKey: appConfig.minioSecretAccessKey,
          },
        });
      },
      inject: [ConfigService],
    },
    {
      provide: IFileService,
      useExisting: S3Service,
    },
  ],
  exports: [S3Service, S3Lib, IFileService],
})
export class S3Module {}
