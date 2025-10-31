import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { User } from './user/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from './user/infrastructure/users.repository';
import { AuthController } from './auth/api/auth-controller';
import { BcryptService } from './user/application/bcrypt.service';
import { CreateUserUserCase } from './user/application/usecases/create-user.usecase';
import { UserAccountsConfig } from './user/config/user-accounts.config';
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
import { JwtRtStrategy } from './guards/bearer/refresh-token/jwt.rt.strategy';
import { DeleteDeviceUseCase } from './device/application/usecases/delete-device.usecase';
import { UsersController } from './user/application/api/users.controller';

const commandHandler = [
  //user
  CreateUserUserCase,
  LoginUserUseCase,
  //user

  //device
  CreateDeviceUseCase,
  UpdateDeviceUseCase,
  DeleteDeviceUseCase,
  //device
];

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([User, Device])],
  controllers: [AuthController, UsersController],
  providers: [
    ...commandHandler,
    BcryptService,
    UsersRepository,
    UsersQueryRepository,
    DevicesRepository,
    DevicesQueryRepository,
    AuthService,
    JwtService,
    JwtStrategy,
    JwtRtStrategy,
    //пример инстанцирования через токен
    //если надо внедрить несколько раз один и тот же класс
    {
      provide: ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
      useFactory: (userAccountConfig: UserAccountsConfig): JwtService => {
        return new JwtService({
          secret: userAccountConfig.accessTokenSecret,
          signOptions: { expiresIn: userAccountConfig.accessTokenExpireIn },
        });
      },
      inject: [UserAccountsConfig],
    },
    {
      provide: REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
      useFactory: (userAccountConfig: UserAccountsConfig): JwtService => {
        return new JwtService({
          secret: userAccountConfig.refreshTokenSecret,
          signOptions: { expiresIn: userAccountConfig.refreshTokenExpireIn },
        });
      },
      inject: [UserAccountsConfig],
    },
    UserAccountsConfig,
  ],
})
export class UserAccountsModule {}
