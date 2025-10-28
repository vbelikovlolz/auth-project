import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { User } from './user/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from './user/infrastructure/users.repository';
import { AuthController } from './auth/api/auth-controller';
import { BcryptService } from './user/application/bcrypt.service';
import { CreateUserUserCase } from './user/application/usecases/create-user.usecase';

const commandHandler = [CreateUserUserCase];

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([User])],
  controllers: [AuthController],
  providers: [...commandHandler, BcryptService, UsersRepository],
})
export class UserAccountsModule {}
