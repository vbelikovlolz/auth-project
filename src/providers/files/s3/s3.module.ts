import * as AWS from '@aws-sdk/client-s3';
import { Module } from '@nestjs/common';

import { S3Lib } from './constants/do-spaces-service-lib.constant';
import { S3Service } from './s3.service';
import { IFileService } from '../files.adapter';
import { S3Config } from './config/s3.config';

@Module({
  providers: [
    S3Service,
    {
      provide: S3Lib,
      useFactory: (s3config: S3Config) => {
        return new AWS.S3({
          endpoint: 'http://127.0.0.1:9000',
          region: 'ru-central1',
          credentials: {
            accessKeyId: s3config.accessKeyId,
            secretAccessKey: s3config.secretAccessKey,
          },
        });
      },
      inject: [S3Config],
    },
    S3Config,
    {
      provide: IFileService,
      useExisting: S3Service,
    },
  ],
  exports: [S3Service, S3Lib, IFileService],
})
export class S3Module {}
