import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IsNotEmpty } from 'class-validator';
import { configValidationUtility } from '../../../../setup/config-validation.utility';

@Injectable()
export class UserAccountsConfig {
  constructor(private configService: ConfigService<any, true>) {
    configValidationUtility.validateConfig(this);
  }

  @IsNotEmpty({
    message: 'Set Env variable ACCESS_TOKEN_EXPIRE_IN, examples: 1h, 5m, 2d',
  })
  accessTokenExpireIn: number = this.configService.get(
    'ACCESS_TOKEN_EXPIRE_IN',
  );

  @IsNotEmpty({
    message: 'Set Env variable REFRESH_TOKEN_EXPIRE_IN, examples: 1h, 5m, 2d',
  })
  refreshTokenExpireIn: number = this.configService.get(
    'REFRESH_TOKEN_EXPIRE_IN',
  );

  @IsNotEmpty({
    message: 'Set Env variable REFRESH_TOKEN_SECRET, dangerous for security!',
  })
  refreshTokenSecret: string = this.configService.get('REFRESH_TOKEN_SECRET');

  @IsNotEmpty({
    message: 'Set Env variable ACCESS_TOKEN_SECRET, dangerous for security!',
  })
  accessTokenSecret: string = this.configService.get('ACCESS_TOKEN_SECRET');
}
