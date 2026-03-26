import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { User } from './user/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from './user/infrastructure/users.repository';
import { AuthController } from './auth/api/auth-controller';
import { BcryptService } from './user/application/bcrypt.service';
import { CreateUserUserCase } from './user/application/usecases/create-user.usecase';
import { JwtService } from '@nestjs/jwt';
import {
  ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
  REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
} from './user/constans/auth-tokens.inject-constants';
import { UsersQueryRepository } from './user/infrastructure/users.query.repository';
import { DevicesRepository } from './device/infrastructure/devices.repository';
import { DevicesQueryRepository } from './device/infrastructure/devices.query.repository';
import { CreateDeviceUseCase } from './device/application/usecases/create-device.usecase';
import { LoginUserUseCase } from './user/application/usecases/login-user.usecase';
import { Device } from './device/domain/device.entity';
import { AuthService } from './auth/application/auth.service';
import { UpdateDeviceUseCase } from './device/application/usecases/update-device.usecase';
import { JwtStrategy } from './guards/bearer/jwt.strategy';
import JwtRtStrategy from './guards/bearer/refresh-token/jwt.rt.strategy';
import { DeleteDeviceUseCase } from './device/application/usecases/delete-device.usecase';
import { UsersController } from './user/application/api/users.controller';
import { UserAvatarsEntity } from './user/user.avatars.entity';
import { UploadUserAvatarUseCase } from './user/application/usecases/upload-user-avatar.usecase';
import { DeleteUserAvatarUseCase } from './user/application/usecases/delete-user-avatar.usecase';
import { S3Module } from '../../providers/files/s3/s3.module';
import { UsersAvatarsRepository } from './user/infrastructure/users.avatars.repository';
import { RedisModule } from '../redis/redis.module';
import { TransferBalanceUserUseCase } from './user/application/usecases/transfer-balance-user.usecase';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppConfig, appConfig } from '../../config/app.config';

const commandHandler = [
  //user
  CreateUserUserCase,
  LoginUserUseCase,
  UploadUserAvatarUseCase,
  DeleteUserAvatarUseCase,
  //user

  //device
  CreateDeviceUseCase,
  UpdateDeviceUseCase,
  DeleteDeviceUseCase,
  //device

  //transfer balance
  TransferBalanceUserUseCase,
];

@Module({
  imports: [
    ConfigModule.forFeature(appConfig),
    CqrsModule,
    S3Module,
    TypeOrmModule.forFeature([User, Device, UserAvatarsEntity]),
    RedisModule,
  ],
  controllers: [AuthController, UsersController],
  providers: [
    ...commandHandler,
    BcryptService,
    UsersRepository,
    UsersQueryRepository,
    DevicesRepository,
    DevicesQueryRepository,
    UsersAvatarsRepository,
    AuthService,
    JwtService,
    JwtStrategy,
    JwtRtStrategy,
    //пример инстанцирования через токен
    //если надо внедрить несколько раз один и тот же класс
    {
      provide: ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
      useFactory: (configService: ConfigService): JwtService => {
        type JwtExpireIn = `${number}${'s' | 'm' | 'h' | 'd'}`;

        const appConfig = configService.get<AppConfig>('app')!;

        return new JwtService({
          secret: appConfig.accessTokenSecret,
          signOptions: {
            expiresIn: appConfig.accessTokenExpireIn as JwtExpireIn,
          },
        });
      },
      inject: [ConfigService],
    },
    {
      provide: REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
      useFactory: (configService: ConfigService): JwtService => {
        const appConfig = configService.get<AppConfig>('app')!;
        type JwtExpireIn = `${number}${'s' | 'm' | 'h' | 'd'}`;

        return new JwtService({
          secret: appConfig.refreshTokenSecret,
          signOptions: {
            expiresIn: appConfig.refreshTokenExpireIn as JwtExpireIn,
          },
        });
      },
      inject: [ConfigService],
    },
    // UserAccountsConfig,
  ],
  exports: [UsersRepository],
})
export class UserAccountsModule {}
