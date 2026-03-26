import { registerAs } from '@nestjs/config';
import {
  IsString,
  IsInt,
  Min,
  Max,
  IsNotEmpty,
  IsEnum,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';
import { configValidationUtility } from '../setup/config-validation.utility';

enum PostgresType {
  Postgres = 'postgres',
  Mysql = 'mysql',
  Sqlite = 'sqlite',
}

class AppConfigClass {
  @IsString()
  redisHost: string = 'localhost';

  @IsString()
  redisPass: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(65535)
  redisPort: number = 6379;

  @IsNotEmpty({
    message: 'Set Env variable ACCESS_TOKEN_SECRET',
  })
  @IsString()
  accessTokenSecret: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^\d+[smhd]$/, {
    message: 'Expire time must be in format: 15s, 5m, 2h, 1d',
  })
  accessTokenExpireIn: string;

  @IsNotEmpty({
    message: 'Set Env variable REFRESH_TOKEN_SECRET',
  })
  @IsString()
  refreshTokenSecret: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^\d+[smhd]$/, {
    message: 'Expire time must be in format: 15s, 5m, 2h, 1d',
  })
  refreshTokenExpireIn: string;

  @IsNotEmpty({
    message: 'Set Env variable MINIO_ROOT_USER',
  })
  @IsString()
  minioRootUser: string;

  @IsNotEmpty({
    message: 'Set Env variable MINIO_ROOT_PASSWORD',
  })
  @IsString()
  minioRootPassword: string;

  @IsNotEmpty({
    message: 'Set Env variable MINIO_ACCESS_KEY_ID',
  })
  @IsString()
  minioAccessKeyId: string;

  @IsNotEmpty({
    message: 'Set Env variable MINIO_SECRET_ACCESS_KEY',
  })
  @IsString()
  minioSecretAccessKey: string;

  @IsNotEmpty({
    message: 'Set Env variable POSTGRES_TYPE (postgres, mysql, sqlite)',
  })
  @IsEnum(PostgresType)
  postgresType: PostgresType;

  @IsNotEmpty({
    message: 'Set Env variable POSTGRES_HOST',
  })
  @IsString()
  postgresHost: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(65535)
  @IsNotEmpty({
    message: 'Set Env variable POSTGRES_PORT',
  })
  postgresPort: number;

  @IsNotEmpty({
    message: 'Set Env variable POSTGRES_USERNAME',
  })
  @IsString()
  postgresUsername: string;

  @IsNotEmpty({
    message: 'Set Env variable POSTGRES_PASSWORD',
  })
  @IsString()
  postgresPass: string;

  @IsNotEmpty({
    message: 'Set Env variable POSTGRES_DATABASE',
  })
  @IsString()
  postgresDb: string;

  @IsNotEmpty({
    message: 'Set Env variable REDIS_DATABASE',
  })
  @IsInt()
  redisDb: number;
}

export const appConfig = registerAs('app', () => {
  const rawConfig = {
    redisHost: process.env.REDIS_HOST,
    redisPort: process.env.REDIS_PORT,
    redisPass: process.env.REDIS_PASSWORD,
    redisDb: process.env.REDIS_DATABASE,
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    accessTokenExpireIn: process.env.ACCESS_TOKEN_EXPIRE_IN,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
    refreshTokenExpireIn: process.env.REFRESH_TOKEN_EXPIRE_IN,
    minioRootUser: process.env.MINIO_ROOT_USER,
    minioRootPassword: process.env.MINIO_ROOT_PASSWORD,
    minioAccessKeyId: process.env.MINIO_ACCESS_KEY_ID,
    minioSecretAccessKey: process.env.MINIO_SECRET_ACCESS_KEY,
    postgresType: process.env.POSTGRES_TYPE,
    postgresHost: process.env.POSTGRES_HOST,
    postgresPort: process.env.POSTGRES_PORT,
    postgresUsername: process.env.POSTGRES_USERNAME,
    postgresPass: process.env.POSTGRES_PASSWORD,
    postgresDb: process.env.POSTGRES_DATABASE,
  };

  return configValidationUtility.validateConfig(AppConfigClass, rawConfig);
});
export type AppConfig = ReturnType<typeof appConfig>;
