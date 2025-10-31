import { UsersRepository } from '../../user/infrastructure/users.repository';
import { BcryptService } from '../../user/application/bcrypt.service';
import { JwtService } from '@nestjs/jwt';
import { UserAccountsConfig } from '../../user/config/user-accounts.config';
import { DomainException } from '../../../../core/exceptions/domain-exceptions';
import { DomainExceptionCode } from '../../../../core/exceptions/domain-exception-codes';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    protected usersRepository: UsersRepository,
    protected bcryptService: BcryptService,
    private jwtService: JwtService,
    private userAccountConfig: UserAccountsConfig,
  ) {}

  async validateUser(login: string, password: string) {
    const user = await this.usersRepository.findByLogin(login);
    if (!user) {
      return null;
    }

    const isPassCorrect = await this.bcryptService.checkPassword(
      password,
      user.passwordHash,
    );

    if (!isPassCorrect) {
      return null;
    }
    return user;
  }

  async checkCredentials(loginOrEmail: string, password: string) {
    const user = await this.usersRepository.getUserByLoginOrEmail(loginOrEmail);

    if (!user) {
      throw new DomainException({
        code: DomainExceptionCode.Unauthorized,
        message: 'user not found',
      });
    }

    const isPassCorrect = await this.bcryptService.checkPassword(
      password,
      user.passwordHash,
    );

    if (!isPassCorrect) {
      throw new DomainException({
        code: DomainExceptionCode.Unauthorized,
        message: 'password is not correct',
      });
    }
    return user;
  }
  async validateToken(token: string): Promise<any> {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.userAccountConfig.refreshTokenSecret,
      });
      return payload;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }
}
