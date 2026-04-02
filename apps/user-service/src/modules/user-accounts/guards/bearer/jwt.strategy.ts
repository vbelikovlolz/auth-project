import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UserContextDto } from '../dto/user-context.dto';
import { UsersQueryRepository } from '../../user/infrastructure/users.query.repository';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '../../../../types/jwt.types';
import { AppConfig } from '../../../../config/app.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private usersQueryRepository: UsersQueryRepository,
    private configService: ConfigService,
  ) {
    const appConfig = configService.get<AppConfig>('app')!;

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: appConfig.accessTokenSecret,
    });
  }

  /**
   * функция принимает payload из jwt токена и возвращает то, что будет записано в req.user
   * @param payload
   */
  async validate(payload: JwtPayload): Promise<UserContextDto> {
    await this.usersQueryRepository.getByIdOrNotFoundFail(payload.userId);
    return {
      id: payload.userId,
    };
  }
}
