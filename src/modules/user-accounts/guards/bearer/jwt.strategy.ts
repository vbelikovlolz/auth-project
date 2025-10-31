import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UserAccountsConfig } from '../../user/config/user-accounts.config';
import { UserContextDto } from '../dto/user-context.dto';
import { UsersQueryRepository } from '../../user/infrastructure/users.query.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private usersQueryRepository: UsersQueryRepository,
    private userAccountsConfig: UserAccountsConfig,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: userAccountsConfig.accessTokenSecret,
    });
  }

  /**
   * функция принимает payload из jwt токена и возвращает то, что будет записано в req.user
   * @param payload
   */
  async validate(payload: any): Promise<UserContextDto> {
    console.log(payload);

    const user = await this.usersQueryRepository.getByIdOrNotFoundFail(
      payload.userId,
    );
    return {
      id: payload.userId,
    };
  }
}
